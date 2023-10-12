import * as React from "react";
import Button from "@mui/material/Button";
import {
    GridFilterItem,
    GridAddIcon,
    GridPanelContent,
    GridPanelFooter,
    GridPanelWrapper,
    GridFilterForm,
    useGridApiContext,
    GridLogicOperator,
    GridRemoveIcon,
    useGridSelector,
    gridFilterModelSelector,
    gridFilterableColumnDefinitionsSelector,
    useGridRootProps,
} from "@mui/x-data-grid";
import { GridFilterPanelProps } from "@mui/x-data-grid/components/panel/filterPanel/GridFilterPanel";
import { GridStateColDef } from "@mui/x-data-grid/models/colDef/gridColDef";

interface CustomGridFilterPanelProps extends GridFilterPanelProps {
    disableMultipleColumnsFiltering?: boolean;
}
const getGridFilter = (col: GridStateColDef<any>): GridFilterItem => ({
    field: col.field,
    operator: col.filterOperators ? col.filterOperators[0].value : '',
    id: Math.round(Math.random() * 1e5)
});
export const CustomGridFilterPanel: React.FC<CustomGridFilterPanelProps> = (
    props
) => {
    const {
        logicOperators = [GridLogicOperator.And, GridLogicOperator.Or],
        columnsSort,
        filterFormProps,
        getColumnForNewFilter,
        disableAddFilterButton = false,
        disableRemoveAllButton = false
    } = props

    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
    const filterableColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);

    const getDefaultFilter = React.useCallback(() => {
        let nextColumnWithOperator;
        if (getColumnForNewFilter && typeof getColumnForNewFilter === 'function') {
            // To allow override the column for default (first) filter
            const nextFieldName = getColumnForNewFilter({
                currentFilters: (filterModel == null ? void 0 : filterModel.items) || [],
                columns: filterableColumns
            });
            if (nextFieldName === null) {
                return null;
            }
            nextColumnWithOperator = filterableColumns.find(({
                field
            }) => field === nextFieldName);
        } else {
            nextColumnWithOperator = filterableColumns.find(colDef => {
                var _colDef$filterOperato;
                return (_colDef$filterOperato = colDef.filterOperators) == null ? 0 : _colDef$filterOperato.length;
            });
        }
        if (!nextColumnWithOperator) {
            return null;
        }

        return getGridFilter(nextColumnWithOperator);
    }, [filterModel === null ? false : filterModel.items, filterableColumns, getColumnForNewFilter]);

    const lastFilterRef = React.useRef<HTMLInputElement>(null);


    const placeholderFilter = React.useRef<GridFilterItem>(getDefaultFilter());
    const items = React.useMemo(() => {
        if (filterModel.items.length) {
            return filterModel.items;
        }
        return placeholderFilter.current ? [placeholderFilter.current] : [];
    }, [filterModel.items, getDefaultFilter]);

    const applyFilter = React.useCallback((item: GridFilterItem) => {
        apiRef.current.upsertFilterItem(item);
    }, [apiRef]);
    const deleteFilter = React.useCallback((item: GridFilterItem) => {
        const shouldCloseFilterPanel = items.length === 1;
        apiRef.current.deleteFilterItem(item);
        if (shouldCloseFilterPanel) {
            apiRef.current.hideFilterPanel();
        }
    }, [apiRef, items.length]);
    const getNewFilter = React.useCallback(() => {
        if (getColumnForNewFilter === undefined || typeof getColumnForNewFilter !== 'function') {
            return getDefaultFilter();
        }
        const currentFilters = filterModel.items.length ? filterModel.items : [getDefaultFilter()].filter(Boolean);

        // If no items are there in filterModel, we have to pass defaultFilter
        const nextColumnFieldName = getColumnForNewFilter({
            currentFilters: currentFilters.filter(x => x) as GridFilterItem[],
            columns: filterableColumns
        });
        if (nextColumnFieldName === null) {
            return null;
        }
        const nextColumnWithOperator = filterableColumns.find(({
            field
        }) => field === nextColumnFieldName);
        if (!nextColumnWithOperator) {
            return null;
        }
        return getGridFilter(nextColumnWithOperator);
    }, [filterModel.items, filterableColumns, getColumnForNewFilter, getDefaultFilter]);
    const addNewFilter = () => {
        const newFilter = getNewFilter();
        if (!newFilter) {
            return;
        }
        apiRef.current.upsertFilterItems([...items, newFilter]);
    };
    const hasMultipleFilters = items.length > 1;
    const applyFilterLogicOperator = React.useCallback((operator: GridLogicOperator) => {
        apiRef.current.setFilterLogicOperator(operator);
    }, [apiRef]);
    const handleRemoveAll = () => {
        if (items.length === 1 && items[0].value === undefined) {
            apiRef.current.deleteFilterItem(items[0]);
            apiRef.current.hideFilterPanel();
        }
        apiRef.current.setFilterModel(Object.assign({}, filterModel, {
            items: []
        }));
    };

    React.useEffect(() => {
        if (logicOperators.length > 0 && filterModel.logicOperator && !logicOperators.includes(filterModel.logicOperator)) {
            applyFilterLogicOperator(logicOperators[0]);
        }
    }, [logicOperators, applyFilterLogicOperator, filterModel.logicOperator]);
    React.useEffect(() => {
        if (items.length > 0) {
            lastFilterRef.current?.focus();
        }
    }, [items.length]);

    return (
        <GridPanelWrapper>
            <GridPanelContent>
                {items.map((item, index) => (
                    <GridFilterForm
                        key={item.id}
                        item={item}
                        applyFilterChanges={applyFilter}
                        deleteFilter={deleteFilter}
                        hasMultipleFilters={hasMultipleFilters}
                        showMultiFilterOperators={index > 0}
                        multiFilterOperator={filterModel.logicOperator}
                        disableMultiFilterOperator={index !== 1}
                        applyMultiFilterOperatorChanges={applyFilterLogicOperator}
                        focusElementRef={index === items.length - 1 ? lastFilterRef : null}
                    />
                ))}
            </GridPanelContent>
            <GridPanelFooter>
                <Button
                    onClick={addNewFilter}
                    startIcon={<GridAddIcon />}
                    color="primary"
                >
                    {apiRef!.current.getLocaleText("filterPanelAddFilter")}
                </Button>
                <Button
                    onClick={handleRemoveAll}
                    startIcon={<GridRemoveIcon />}
                    color="primary"
                >
                    {apiRef!.current.getLocaleText("filterPanelRemoveAll")}
                </Button>
            </GridPanelFooter>
        </GridPanelWrapper>
    );
};
