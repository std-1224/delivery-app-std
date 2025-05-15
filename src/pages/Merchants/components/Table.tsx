import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Avatar,
  IconButton,
  Box,
  Dialog,
  DialogContent, DialogContentText, DialogActions, Button, Accordion, AccordionSummary, Typography, AccordionDetails, TableSortLabel
} from "@mui/material";
import { Delete, Edit, ExpandMore, RemoveRedEye } from "@mui/icons-material";
import { Droppable,
  DragDropContext,
  Draggable,
  DraggableProvided,
  DroppableProvided, } from "../../../utils/dnd-imports";

// Import Components
import MerchantForm from "./MerchantForm";

// Import Types
import { IMerchant } from "../../../types/MerchantTypes";

// Import Actions
import { deleteMerchant, updateMerchantOrder } from "../../../actions/merchantActions";
import { isWindow, resizeFun } from "../../../components/common";

const TableView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [visibleMerchantFormMdoal, setVisibleMerchantFormMdoal] = useState(false);
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<IMerchant>();
  const [merchantList, setMerchantList] = useState<any>();
  const [windowWidth, setWindowWidth] = useState<any>();
  const [orderDirection, setorderDirection] = useState<any>("asc")
  const [defaultSort, setDefaultSort] = useState<any>("name");

  const merchants = useAppSelector((state) => state.merchants.list);
  const categories = useAppSelector((state) => state.categories.list);

  const [expanded, setExpanded] = useState<string | false>(merchants[0]?.name)

  const handleChangePanel =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleCloseModal = () => {
    setVisibleMerchantFormMdoal(false);
  };

  const showEditModal = (merchant: IMerchant) => {
    setVisibleMerchantFormMdoal(true);
    setSelectedMerchant(merchant);
  };

  const handleDeleteMerchant = () => {
    setVisibleConfirmModal(false);
    dispatch(deleteMerchant(selectedMerchant?.id));
  };

  const showDeleteConfirmModal = (merchant: IMerchant) => {
    setVisibleConfirmModal(true);
    setSelectedMerchant(merchant)
  };

  useEffect(() => {
    setMerchantList(merchants);
  }, [merchants]);


  const sortData = (sortBy: any, sortOrder: any) => {
    var itemsToSort = [...merchants];
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
      case "category":
        compareFn = (i: any, j: any) => {
          if (i.category < j.category) {
            return sortOrder === "asc" ? -1 : 1;
          } else {
            if (i.category > j.category) {
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
      setMerchantList(sortedItems)
    };
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const originalOrder = merchantList.find((merchant: IMerchant) => merchant.id === result.draggableId).order;
    const destinationOrder = merchantList[result.destination!.index].order;

    dispatch(updateMerchantOrder(originalOrder, destinationOrder));

    setMerchantList((prev: any) => {
      const merchant = [...prev];      
      const src = {...merchant[result.source?.index]};

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

  const tableContent = (merchant: IMerchant) => {
    return <>
      {windowWidth <= 1024 ?
        <>
          <div className="responsive-content">{merchant.name}</div>
          <div className="responsive-content"><Avatar aria-label="recipe"><img src={merchant.logo} alt="" /></Avatar></div>
          <div className="responsive-content">{merchant.description}</div>
          <div className="responsive-content">{categories.find((category) => category.id === merchant.category)?.name}</div>
          <div className="responsive-content">{merchant.address}</div>
          <div className="responsive-content">{merchant.phone}</div>
          <div className="responsive-content">{merchant.email}</div>
          <div className="responsive-content"><img className="merchant-image" src={merchant.image} alt="StoreImage" height={120} /></div>
          <div className="responsive-content">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="merchant-icon">
              <IconButton aria-label="view" onClick={() => { navigate("/merchants/" + merchant.id) }} size="small">
                <RemoveRedEye />
              </IconButton>
              <IconButton aria-label="edit" color="primary" onClick={() => showEditModal(merchant)} size="small">
                <Edit />
              </IconButton>
              <IconButton aria-label="delete" color="secondary" onClick={() => showDeleteConfirmModal(merchant)} size="small">
                <Delete />
              </IconButton>
            </Box>
          </div>
        </> :
        <>
          <TableCell>{merchant.name}</TableCell>
          <TableCell><Avatar aria-label="recipe"><img src={merchant.logo} alt="" /></Avatar></TableCell>
          <TableCell>{merchant.description}</TableCell>
          <TableCell>{categories.find((category) => category.id === merchant.category)?.name}</TableCell>
          <TableCell>{merchant.address}</TableCell>
          <TableCell>{merchant.phone}</TableCell>
          <TableCell>{merchant.email}</TableCell>
          <TableCell><img className="merchant-image" src={merchant.image} alt="StoreImage" height={120} /></TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="merchant-icon">
              <IconButton aria-label="view" onClick={() => { navigate("/merchants/" + merchant.id) }} size="small">
                <RemoveRedEye />
              </IconButton>
              <IconButton aria-label="edit" color="primary" onClick={() => showEditModal(merchant)} size="small">
                <Edit />
              </IconButton>
              <IconButton aria-label="delete" color="secondary" onClick={() => showDeleteConfirmModal(merchant)} size="small">
                <Delete />
              </IconButton>
            </Box>
          </TableCell>
        </>}
    </>
  }

  return (
    <>
      {windowWidth <= 1024 ? <div className="merchant_table">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(droppableProvided: DroppableProvided) => (
              <div ref={droppableProvided.innerRef}{...droppableProvided.droppableProps}>
                {merchantList?.length > 0 && merchantList?.map((merchant: any, index: number) => (
                  <Draggable key={merchant.id} draggableId={merchant.id} index={index}>
                    {(draggableProvided: DraggableProvided) => {
                      return (
                        <div
                          ref={draggableProvided.innerRef}
                          style={{ ...draggableProvided.draggableProps.style }}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <Accordion expanded={expanded === merchant.name} onChange={handleChangePanel(merchant.name)} style={{ marginBottom: "15px" }} key={merchant.id}>
                            <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" id="panel1bh-header">
                              <Typography sx={{ flexShrink: 0 }}>{merchant.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>{tableContent(merchant)}</AccordionDetails>
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
      </div> : <TableContainer component={Paper} className="merchant-container">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="header-title">
                <TableSortLabel
                  active={defaultSort === "name"}
                  direction={orderDirection}
                  onClick={requestSort("name")}>Name</TableSortLabel></TableCell>
              <TableCell>Logo</TableCell>
              <TableCell>Description</TableCell>
              <TableCell className="header-title">
                <TableSortLabel
                  active={defaultSort === "category"}
                  direction={orderDirection}
                  onClick={requestSort("category")}>Category</TableSortLabel></TableCell>
              <TableCell>Address</TableCell>
              <TableCell style={{ width: "100%" }}>Contact Number</TableCell>
              <TableCell>Contact Mail</TableCell>
              <TableCell>Image</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="vertical">
              {(droppableProvided: DroppableProvided) => (
                <TableBody ref={droppableProvided.innerRef}{...droppableProvided.droppableProps}>
                  {merchantList?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9}>There is no merchants</TableCell>
                    </TableRow>
                  )}
                  {merchantList?.length > 0 && merchantList?.map((merchant: any, index: number) => (
                    <Draggable key={merchant.id} draggableId={merchant.id} index={index}>
                      {(draggableProvided: DraggableProvided) => {
                        return (
                          <TableRow
                            ref={draggableProvided.innerRef}
                            style={{ ...draggableProvided.draggableProps.style }}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            {tableContent(merchant)}
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
        </Table>
      </TableContainer>
      }
      {visibleMerchantFormMdoal && (
        <MerchantForm
          open={visibleMerchantFormMdoal}
          mode="Edit"
          closeModal={() => handleCloseModal()}
          merchant={selectedMerchant}
        />
      )}
      {visibleConfirmModal && (
        <Dialog open={visibleConfirmModal} onClose={() => setVisibleConfirmModal(false)}>
          <DialogContent>
            <DialogContentText>
              Are you sure to delete this merchant?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVisibleConfirmModal(false)}>No</Button>
            <Button onClick={() => handleDeleteMerchant()}>Yes</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default TableView;