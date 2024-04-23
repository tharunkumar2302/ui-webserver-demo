import {
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const SimpleTable = ({ applied, proccessed, scheduled, selected, notSelected, withDraw }) => {
  return (

    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="center">Applied</TableCell>
            <TableCell align="center">Proccessed</TableCell>
            <TableCell align="center">Scheduled</TableCell>
            <TableCell align="center">Selected</TableCell>
            <TableCell align="center">Not Selected</TableCell>
            <TableCell align="center">WithDraw</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell align="center">{applied}</TableCell>
            <TableCell align="center">{proccessed}</TableCell>
            <TableCell align="center">{scheduled}</TableCell>
            <TableCell align="center">{selected}</TableCell>
            <TableCell align="center">{notSelected}</TableCell>
            <TableCell align="center">{withDraw}</TableCell>
          </TableRow>
        </TableBody>
      </StyledTable>
    </Box>
  );
};

export default SimpleTable;
