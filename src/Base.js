import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  Column,
  Table,
  defaultTableRowRenderer,
  defaultTableCellDataGetter,
  defaultTableHeaderRenderer,
  SortDirection,
} from "react-virtualized";

import "react-virtualized/styles.css"; // only needs to be imported once

import SortIndicator from "./SortIndicator.js";
import { get } from "../utils/misc.js";
import { ContextMenu } from "./common/contextMenu.js";

const WrappedSortIndicator = styled(SortIndicator)`
  margin-left: 10px;
`;

const TableWrapper = styled(Table)`
  .ReactVirtualized__Grid {
    outline: 0;
    ${(props) => props.gridSize && `font-size: ${props.fontSize}`}

    .ReactVirtualized__Grid::-webkit-scrollbar-thumb {
        border-radius: 15px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: ${(props) => props.theme.colors.scrollbarThumb};
      }
      
      .border {
        border-right: 2px solid ${(props) => props.theme.colors.tableBorder};
      }
      
      .center {
        text-align: center;
      }
      
      .right {
        text-align: right;
      }
      
      .groupingValue {
        font-weight: bold;
      }
      
      .ReactVirtualized__Table__headerColumn {
        outline-width: 0;
      }
      
      .ReactVirtualized__Grid__innerScrollContainer {
        background-color: ${(props) => props.theme.colors.blockBgDark2};
      }
      
  `;
const HeaderText = styled.span`
  color: ${(props) => props.theme.colors.titleDark};
  font-size: ${(props) => props.theme.text.size.mid};
  letter-spacing: ${(props) => props.theme.text.title.small.spacing};
  font-weight: 300;
  text-transform: none;
`;

const renderHeader = ({
  dataKey,
  label,
  sortBy,
  sortDirection,
  title,
  ...props
}) => {
  const children = [
    <HeaderText key="label" title={title || label}>
      {label}
    </HeaderText>,
  ];

  const showSortIndicator = sortBy === dataKey;
  if (showSortIndicator) {
    children.push(
      <WrappedSortIndicator sortDirection={sortDirection} key="sortIndicator" />
    );
  }
  return children;
};

const mapRowBackground = (isOddRow) => {
  if (isOddRow) {
    return "tableOddRowDark";
  }
  return "tableEvenRowDark";
};

export const AlternatingRowWrapper = styled.div`
  background: ${(props) =>
    props.theme.colors[mapRowBackground(props.isOddRow)]};
  border-bottom: 2px solid ${(props) => props.theme.colors.tableBorder};
  font-size: ${(props) => props.theme.text.size.midBig};
  font-weight: 300;
  letter-spacing: 1px;
  cursor: ${(props) => (props.isClickable ? "pointer" : "default")};
`;

export const FlexColumnWrapper = styled.div`
  position: relative;
  display: flex;
  align-content: flex-start;
  align-items: stretch;
`;
class BaseGrid extends React.Component {
  constructor(props) {
    super(props);

    const sortFunction = (a, b, sortBy, va, vb) => {
      const a = get(a, sortBy);
      const b = get(b, sortBy);
      return a > b ? va : a < b ? vb : 0;
    };

    this.sortingFunc = {};
    this.sortingFunc[SortDirection.ASC] = (a, b) =>
      sortFunction(a, b, sortBy, 1, -1);
    this.sortingFunc[SortDirection.DESC] = (a, b) =>
      sortFunction(a, b, sortBy, -1, 1);
  }

  render() {
    const {
      data,
      columns,
      rowRenderer,
      cellDataGetter,
      width,
      height,
      columnWidth,
      rowHeight,
      headerHeight,
      sortBy,
      sortDirection,
      onSort,
      dataAsObjectArray,
      rowStyle,
      scrollTop,
      fontSize,
      onRowClick,
      rowIdField,
      selectedRowId,
      exportTitle,
    } = this.props;
    let columnsInData = [];
    if (dataAsObjectArray) {
      columnsInData = Object.keys(data);
    }

    if (sortBy) {
      data.sort(this.sortingFunc[sortDirection][sortBy]);
    }

    const getRows = (index) => {
      let mergedObj = [];
      if (dataAsObjectArray) {
        mergedObj = columnsInData.map((e) => ({
          [e]: data[e][index],
        }));
        const yy = Object.assign({}, ...mergedObj);
        return yy;
      }
      return data[index];
    };

    const getRowIndex = () => {
      if (!rowIdField || !selectedRowId) return -1;
      if (dataAsObjectArray) return -1;
      return data.findIndex((row) => row[rowIdField] === selectedRowId);
    };

    const dataGetter = cellDataGetter
      ? ({ dataKey, rowData }) => cellDataGetter(dataKey, rowData)
      : defaultTableCellDataGetter;

    const columnNodes = columns.map((col, i) => (
      <Column
        key={i}
        width={col.width || columnWidth}
        label={col.label}
        dataKey={col.dataKey}
        headerRenderer={headerRenderer || defaultTableHeaderRenderer}
        cellDataGetter={cellDataGetter}
        cellRenderer={({ cellData, rowData }) =>
          col.renderFunc ? col.renderFunc(cellData, rowData) : cellData
        }
        className={`${col.borderRight && "border"} ${col.center && "center"} ${
          col.right && "right"
        }`}
        headerClassName={`${col.right && "right"}`}
      />
    ));

    const lengthOfArray =
      (data && columnsInData[0] && data[columnsInData[0]].length) || 0;

    return (
      <ContextMenu headers={columns} data={data} title={exportTitle}>
        <TableWrapper
          width={width}
          height={height}
          headerHeight={headerHeight}
          rowHeight={rowHeight}
          rowCount={
            dataAsObjectArray ? lengthOfArray : (data && data.length) || 0
          }
          rowGetter={({ index }) => getRows(index)}
          rowRenderer={rowRenderer}
          sort={({ sortBy, sortDirection }) =>
            onSort && onSort(sortBy, sortDirection)
          }
          sortBy={sortBy}
          sortDirection={sortDirection}
          scrollToAlignment={"start"}
          autoHeight={dataAsObjectArray}
          scrollTop={scrollTop}
          rowStyle={({ index }) => (rowStyle && rowStyle(index)) || null}
          fontSize={fontSize}
          onRowClick={onRowClick}
          scrollToIndex={getRowIndex()}
        >
          {columnNodes}
        </TableWrapper>
      </ContextMenu>
    );
  }
}
BaseGrid.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  width: PropTypes.number,
  height: PropTypes.number,
  rowHeight: PropTypes.number,
  headerHeight: PropTypes.number,
  columnWidth: PropTypes.number,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string,
      label: PropTypes.string,
      borderRight: PropTypes.bool,
      center: PropTypes.bool,
      right: PropTypes.bool,
      width: PropTypes.number,
      renderFunc: PropTypes.func,
    })
  ),
  cellDataGetter: PropTypes.func,
  rowRenderer: PropTypes.func,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC]),
  onSort: PropTypes.func,
  rowIdField: PropTypes.string,
  selectedRowId: PropTypes.string,
};

BaseGrid.defaultProps = {
  data: [],
  width: 400,
  height: 400,
  rowHeight: 50,
  headerHeight: 30,
  columnWidth: 200,
  sortDirection: SortDirection.DESC,
};

export default BaseGrid;
