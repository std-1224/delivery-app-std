import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Box,
  Dialog,
  DialogContent, DialogContentText, DialogActions, Button, Accordion, AccordionSummary, Typography, AccordionDetails, TableSortLabel
} from "@mui/material";
import { Delete, Edit, ExpandMore } from "@mui/icons-material";

// Import Components
import ProductGroupForm from "./ProductGroupForm";

// Import Types
import { IGroup } from "../../../types/GroupType";

// Import Actions
import { getProductGroupsByMerchantId, deleteProductGroup, updateProductGroupOrder } from "../../../actions/productActions";
import { isWindow, resizeFun } from "../../../components/common";
import { DragDropContext,
  Draggable,
  DraggableProvided,
  DroppableProvided,
  Droppable,
   } from "../../../utils/dnd-imports";

const TableView = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [editForm, setEditForm] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<IGroup>();
  const [groupList, setGroupList] = useState<any>();
  const [windowWidth, setWindowWidth] = useState<any>();
  const [orderDirection, setorderDirection] = useState<any>("asc")
  const [defaultSort, setDefaultSort] = useState<any>("name");

  const groups = useAppSelector((state) => state.products.productGroups);

  const [expanded, setExpanded] = useState<string | false>(groups[0]?.name)

  const handleChangePanel =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  useEffect(() => {
    dispatch(getProductGroupsByMerchantId(id));
  }, [dispatch, id]);

  const showEditModal = (group: IGroup) => {
    setEditForm(true);
    setSelectedGroup(group);
  };

  const showDeleteConfirmModal = (group: IGroup) => {
    setSelectedGroup(group);
    setConfirmModal(true);
  };

  const handleCloseModal = () => {
    setEditForm(false);
  };

  const handleDeleteProductGroup = () => {
    setConfirmModal(false);
    dispatch(deleteProductGroup(selectedGroup?.id));
  };

  // useEffect(() => {
  //   if (groups && groups.length > 0) {
  //     let data = [...groups]
  //     const sortList = data?.sort((a: IGroup, b: IGroup) => {
  //       return a.name > b.name ? 1 : -1;
  //     }).sort((a: any, b: any) => {
  //       return parseInt(a.order) > parseInt(b.order) ? 1 : -1;
  //     })
  //     setGroupList(sortList);
  //   }
  // }, [groups])

  useEffect(() => {
    setGroupList(groups);
  }, [groups]);

  const sortData = (sortBy: any, sortOrder: any) => {
    var itemsToSort = [...groups];
    var sortedItems = [];
    var compareFn;
    switch (sortBy) {
      case "name":
        compareFn = (i: any, j: any) => {
          if (i.name < j.name) {
            return sortOrder === "asc" ? -1 : 1;
          } else {
            if (i.name > j.name) {
              return sortOrder === "asc" ? 1 : -1;
            } else {
              return 0;
            }
          }
        };
        break;
      default:
        break;
    }
    sortedItems = itemsToSort.sort(compareFn);
    return sortedItems;
  }

  const requestSort = (pSortBy: any) => {
    let sortBy = defaultSort;
    let sortOrder = orderDirection;
    return () => {
      if (pSortBy === defaultSort) {
        sortOrder = sortOrder === "asc" ? setorderDirection("desc") : setorderDirection("asc");
      } else {
        sortBy = setDefaultSort(pSortBy);
        sortOrder = "asc";
      }
      var sortedItems = sortData(sortBy, orderDirection);
      setGroupList(sortedItems)
    };
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const originalOrder = groupList.find((group: IGroup) => group.id === result.draggableId).order;
    const destinationOrder = groupList[result.destination!.index].order;    

    dispatch(updateProductGroupOrder(originalOrder, destinationOrder));

    setGroupList((prev: any) => {      
      const group = [...prev];      
      const src = {...group[result.source?.index]};

      const srcIndex = result.source?.index
      const destIndex = result.destination?.index

      const direction = srcIndex - destIndex < 0;
      const step =  direction ? 1 : -1;
      return prev?.map((item: any, index: number) => {
        if(index > Math.min(srcIndex, destIndex) && index < Math.max(srcIndex, destIndex)) {
          return prev[index + step]
        }
        if(index === result.destination?.index) {          
          return src
        }
        if(index === result.source?.index) {          
          return prev[index + step]
        }
        return item
      });
    });
  }

  const getWidth = useCallback(() => {
  return isWindow ? window.innerWidth : windowWidth;
}, [windowWidth]);

const resize = useCallback(() => {
    setWindowWidth(getWidth());
  }, [setWindowWidth, getWidth]);

  useEffect(() => {
    if (isWindow) {
      setWindowWidth(getWidth());
      resizeFun(resize)
    }
  }, [getWidth, resize]);

  const tableContent = (group: IGroup) => {
    return <>
      {windowWidth <= 1024 ?
        <>
          <div className="responsive-content" style={{ width: '100%' }} >{group.name}</div>
          <div className="responsive-content">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 90 }}>
              <IconButton aria-label="edit" color="primary" onClick={() => showEditModal(group)} size="small">
                <Edit />
              </IconButton>
              <IconButton aria-label="delete" color="secondary" onClick={() => showDeleteConfirmModal(group)} size="small">
                <Delete />
              </IconButton>
            </Box>
          </div>
        </> :
        <>
          <TableCell style={{ width: '100%' }} >{group.name}</TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 90 }}>
              <IconButton aria-label="edit" color="primary" onClick={() => showEditModal(group)} size="small">
                <Edit />
              </IconButton>
              <IconButton aria-label="delete" color="secondary" onClick={() => showDeleteConfirmModal(group)} size="small">
                <Delete />
              </IconButton>
            </Box>
          </TableCell>
        </>}

    </>
  }

  return (
    <>
      {windowWidth <= 1024 ? <div className="product-group-table">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(droppableProvided: DroppableProvided) => (
              <div ref={droppableProvided.innerRef}{...droppableProvided.droppableProps}>
                {groupList?.length > 0 && groupList?.map((group: IGroup, index: number) => (
                  <Draggable key={group.id} draggableId={group.id} index={index}>
                    {(draggableProvided: DraggableProvided) => {
                      return (
                        <div
                          ref={draggableProvided.innerRef}
                          style={{ ...draggableProvided.draggableProps.style }}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <Accordion expanded={expanded === group.name} onChange={handleChangePanel(group.name)} style={{ marginBottom: "15px" }} key={group.id}>
                            <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" id="panel1bh-header">
                              <Typography sx={{ flexShrink: 0 }}>{group.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>{tableContent(group)}</AccordionDetails>
                          </Accordion>
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div> : <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="header-title" >
                <TableSortLabel
                  active={defaultSort === "name"}
                  direction={orderDirection}
                  onClick={requestSort("name")}>Name</TableSortLabel></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="vertical">
              {(droppableProvided: DroppableProvided) => (
                <TableBody ref={droppableProvided.innerRef}{...droppableProvided.droppableProps}>
                  {groupList?.length > 0 && groupList?.map((group: IGroup, index: number) => (
                    <Draggable key={group.id} draggableId={group.id} index={index}>
                      {(draggableProvided: DraggableProvided) => {
                        return (
                          <TableRow
                            ref={draggableProvided.innerRef}
                            style={{ ...draggableProvided.draggableProps.style }}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                          >
                            {tableContent(group)}
                          </TableRow>
                        );
                      }}
                    </Draggable>
                  ))}
                  {droppableProvided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table >
      </TableContainer>}

      {editForm && (
        <ProductGroupForm
          mode="Edit"
          open={editForm}
          closeModal={() => handleCloseModal()}
          group={selectedGroup}
        />
      )}
      {confirmModal && (
        <Dialog open={confirmModal} onClose={() => setConfirmModal(false)}>
          <DialogContent>
            <DialogContentText>
              Are you sure to delete this product group?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmModal(false)}>No</Button>
            <Button onClick={() => handleDeleteProductGroup()}>Yes</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default TableView;
