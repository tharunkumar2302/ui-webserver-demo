import { useContext } from 'react'
import SelectDataTableContext from 'app/contexts/SelectTableDataContext'

const useSelectDataTable = () => useContext(SelectDataTableContext)

export default useSelectDataTable
