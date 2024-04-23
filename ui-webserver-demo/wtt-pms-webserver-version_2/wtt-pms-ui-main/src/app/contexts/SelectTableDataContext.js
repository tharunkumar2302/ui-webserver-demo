import React, { createContext } from 'react'

const SelectDataTableContext = createContext({
    selectItem: [],
    tableData:[],
    test: "",
    loginUserEmailId: [],
    setTest: () => { },
})

export const SelectDataTableProvider = ({ Testing, children }) => {
    const selectItem = []
    const tableData = []
    const [test, setTest] = React.useState("Hello world")
    const loginUserEmailId = []
    return (
        <SelectDataTableContext.Provider
            value={{
                selectItem: selectItem,
                tableData: tableData,
                test: test,
                setTest: setTest,
                loginUserEmailId: loginUserEmailId,
            }}
        >
            {children}
        </SelectDataTableContext.Provider>
    )
}

export default SelectDataTableContext
