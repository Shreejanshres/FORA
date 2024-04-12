import { Box, Button } from "@mui/material";
import { tokens } from "../../../Theme.jsx";
import { useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const menutable = ({ columns, data, onClick }) => {
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
                <TableCell
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? colors.blueAccent[400]
                        : colors.blueAccent[500],
                    color: "white",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: colors.greenAccent[700],
                      ":hover": {
                        backgroundColor: colors.greenAccent[800],
                      },
                    }}
                    onClick={onClick}
                  >
                    Add Menu
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {row[column.field]}
                    </TableCell>
                  ))}
                  <TableCell>
                    {/* Edit IconButton */}
                    <IconButton
                      sx={{ color: "green" }}
                      onClick={() => onEdit(row.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    {/* Delete IconButton */}
                    <IconButton
                      sx={{ color: "red" }}
                      onClick={() => onDelete(row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
export default menutable;
