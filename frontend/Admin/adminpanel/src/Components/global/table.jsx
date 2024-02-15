import { Box } from "@mui/material";
import { tokens } from "../../Theme.jsx";
import { useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const table = ({ columns, data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box>
      <Paper
        sx={{
          width: "100%",
          borderRadius: "15px 15px 0 0",
        }}
        // square={false}
        elevation={5}
        // variant="outlined"
      >
        <TableContainer
          sx={{
            maxHeight: "73vh",

            borderRadius: "15px 15px 0 0",
            backgroundColor:
              theme.palette.mode === "dark" ? colors.primary[600] : "white",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? colors.blueAccent[400]
                          : colors.blueAccent[500],
                      color: "white",
                    }}
                    key={column.field}
                  >
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {row[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
export default table;
