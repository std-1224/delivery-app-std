import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableSortLabel,
} from "@mui/material";
import { Delete, Edit, ExpandMore } from "@mui/icons-material";

// Import DnD components and types from our utility file instead of directly from react-beautiful-dnd

// Import Components
import CategoryForm from "./CategoryForm";

// Import Types
import { ICategory } from "../../types/CategoryTypes";

// Import Actions
import {
  getAllCategories,
  deleteCategory,
  updateCategoryOrder,
} from "../../actions/categoryActions";
import "../responsiveTable.css";
import { isWindow, resizeFun } from "../../components/common";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableProvided,
  DroppableProvided,
  DraggableStateSnapshot,
} from "../../utils/dnd-imports";

const CategoryListPage = () => {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState("Create");
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleCategoryForm, setVisibleCategoryForm] = useState(false);
  const [categoryList, setCategoryList] = useState<any>();
  const [windowWidth, setWindowWidth] = useState<any>();
  const [orderDirection, setorderDirection] = useState<any>("asc");
  const [defaultSort, setDefaultSort] = useState<any>("name");

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const categories = useAppSelector((state) => state.categories.list);
  const userRole = useAppSelector((state) => state.auth.role);

  const [expanded, setExpanded] = useState<string | false>(categories[0]?.name);

  const handleChangePanel =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const showEditModal = (category: ICategory) => {
    setVisibleCategoryForm(true);
    setMode("Edit");
    setSelectedCategory(category);
  };

  const showDeleteConfirmModal = (category: ICategory) => {
    setSelectedCategory(category);
    setVisibleConfirmModal(true);
  };

  const handleDeleteCategory = () => {
    setVisibleConfirmModal(false);
    dispatch(deleteCategory(selectedCategory?.id));
  };

  const handleCloseFormModal = () => {
    setVisibleCategoryForm(false);
  };

  useEffect(() => {
    setCategoryList(categories);
  }, [categories]);

  const sortData = (sortBy: any, sortOrder: any) => {
    var itemsToSort = [...categories];
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
  };

  const requestSort = (pSortBy: any) => {
    let sortBy = defaultSort;
    let sortOrder = orderDirection;
    return () => {
      if (pSortBy === defaultSort) {
        sortOrder =
          sortOrder === "asc"
            ? setorderDirection("desc")
            : setorderDirection("asc");
      } else {
        sortBy = setDefaultSort(pSortBy);
        sortOrder = "asc";
      }
      var sortedItems = sortData(sortBy, orderDirection);
      setCategoryList(sortedItems);
    };
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const originalOrder = categoryList.find(
      (category: ICategory) => category.id === result.draggableId
    ).order;
    const destinationOrder = categoryList[result.destination!.index].order;

    dispatch(updateCategoryOrder(originalOrder, destinationOrder));

    setCategoryList((prev: any) => {
      const category = [...prev];
      const src = { ...category[result.source?.index] };

      const srcIndex = result.source?.index;
      const destIndex = result.destination?.index;

      const direction = srcIndex - destIndex < 0;
      const step = direction ? 1 : -1;
      return prev?.map((item: any, index: number) => {
        if (
          index > Math.min(srcIndex, destIndex) &&
          index < Math.max(srcIndex, destIndex)
        ) {
          return prev[index + step];
        }
        if (index === result.destination?.index) {
          return src;
        }
        if (index === result.source?.index) {
          return prev[index + step];
        }
        return item;
      });
    });
  };

  const getWidth = useCallback(() => {
    return isWindow ? window.innerWidth : windowWidth;
  }, [windowWidth]);

  const resize = useCallback(() => {
    setWindowWidth(getWidth());
  }, [setWindowWidth, getWidth]);

  useEffect(() => {
    if (isWindow) {
      setWindowWidth(getWidth());
      resizeFun(resize);
    }
  }, [getWidth, resize]);

  const tableContent = (category: ICategory) => {
    return (
      <>
        {windowWidth <= 1024 ? (
          <>
            <div className="responsive-content">{category.name}</div>
            <div className="responsive-content">
              <img
                src={category.image}
                alt=""
                height={120}
                className="merchant-image"
              />
            </div>
            <div className="responsive-content">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  aria-label="edit"
                  color="primary"
                  onClick={() => showEditModal(category)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  color="secondary"
                  onClick={() => showDeleteConfirmModal(category)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </div>
          </>
        ) : (
          <>
            <TableCell>{category.name}</TableCell>
            <TableCell>
              <img
                src={category.image}
                alt=""
                height={120}
                className="merchant-image"
              />
            </TableCell>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  aria-label="edit"
                  color="primary"
                  onClick={() => showEditModal(category)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  color="secondary"
                  onClick={() => showDeleteConfirmModal(category)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </TableCell>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Container sx={{ marginY: 10 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            className="category-title"
            variant="h3"
            sx={{ marginY: 5 }}
          >
            Categories
          </Typography>
          {userRole === "admin" && (
            <Button
              variant="contained"
              sx={{ marginRight: 2 }}
              onClick={() => setVisibleCategoryForm(true)}
            >
              Create
            </Button>
          )}
        </Box>
        {windowWidth <= 1024 ? (
          <div className="category_table">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable" direction="vertical">
                {(droppableProvided: DroppableProvided) => (
                  <div
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                  >
                    {categoryList?.length > 0 &&
                      categoryList?.map(
                        (category: ICategory, index: number) => (
                          <Draggable
                            key={category.id}
                            draggableId={category.id}
                            index={index}
                          >
                            {(draggableProvided: DraggableProvided) => {
                              return (
                                <div
                                  ref={draggableProvided.innerRef}
                                  style={{
                                    ...draggableProvided.draggableProps.style,
                                  }}
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                >
                                  <Accordion
                                    expanded={expanded === category.name}
                                    onChange={handleChangePanel(category.name)}
                                    style={{ marginBottom: "15px" }}
                                    key={category.id}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMore />}
                                      aria-controls="panel1bh-content"
                                      id="panel1bh-header"
                                    >
                                      <Typography sx={{ flexShrink: 0 }}>
                                        {category.name}
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      {tableContent(category)}
                                    </AccordionDetails>
                                  </Accordion>
                                </div>
                              );
                            }}
                          </Draggable>
                        )
                      )}
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        ) : (
          <TableContainer component={Paper} className="category-container">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="header-title">
                    <TableSortLabel
                      active={defaultSort === "name"}
                      direction={orderDirection}
                      onClick={requestSort("name")}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="vertical">
                  {(droppableProvided: DroppableProvided) => (
                    <TableBody
                      ref={droppableProvided.innerRef}
                      {...droppableProvided.droppableProps}
                    >
                      {categoryList?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3}>
                            There is no categories
                          </TableCell>
                        </TableRow>
                      )}
                      {categoryList?.length > 0 &&
                        categoryList?.map(
                          (category: ICategory, index: number) => (
                            <Draggable
                              key={category.id}
                              draggableId={category.id}
                              index={index}
                            >
                              {(
                                draggableProvided: DraggableProvided,
                                snapshot: DraggableStateSnapshot
                              ) => {
                                return (
                                  <TableRow
                                    ref={draggableProvided.innerRef}
                                    style={{
                                      ...draggableProvided.draggableProps.style,
                                    }}
                                    {...draggableProvided.draggableProps}
                                    {...draggableProvided.dragHandleProps}
                                    sx={{
                                      "&:last-child td, &:last-child th": {
                                        border: 0,
                                      },
                                    }}
                                  >
                                    {tableContent(category)}
                                  </TableRow>
                                );
                              }}
                            </Draggable>
                          )
                        )}
                      {droppableProvided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </DragDropContext>
            </Table>
          </TableContainer>
        )}
      </Container>
      {visibleConfirmModal && (
        <Dialog
          open={visibleConfirmModal}
          onClose={() => setVisibleConfirmModal(false)}
        >
          <DialogContent>
            <DialogContentText>
              Are you sure to delete this category?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVisibleConfirmModal(false)}>No</Button>
            <Button onClick={() => handleDeleteCategory()}>Yes</Button>
          </DialogActions>
        </Dialog>
      )}
      {visibleCategoryForm && (
        <CategoryForm
          open={visibleCategoryForm}
          mode={mode}
          closeModal={() => handleCloseFormModal()}
          category={selectedCategory}
        />
      )}
    </>
  );
};

export default CategoryListPage;
