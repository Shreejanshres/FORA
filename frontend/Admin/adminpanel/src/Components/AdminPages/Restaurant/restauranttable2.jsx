import React from "react";
import "../../vendor/fontawesome-free/css/all.min.css";
import "../../vendor/datatables/dataTables.bootstrap4.min.css";
import "../../css/sb-admin-2.min.css";

export default function restauranttable2({ columns, data }) {
	console.log(data);
	return (
		<>
			<div className="card shadow mb-4">
				<div className="card-header py-3">
					<h1 className="m-0 font-weight-bold text-primary">Restaurants</h1>
				</div>
				<div className="card-body">
					<div className="table-responsive">
						<table
							className="table table-bordered"
							id="dataTable"
							width="100%"
							cellSpacing="0"
						>
							<thead>
								<tr>
									{columns.map((column) => (
										<th key={column.field}>{column.headerName}</th>
									))}
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{data.map((row, rowIndex) => (
									<tr key={rowIndex}>
										{columns.map((column, colIndex) => (
											<td key={colIndex}>{row[column.field]}</td>
										))}
										<td>
											<a href="#" className="btn btn-danger btn-circle btn-sm">
												<i className="fas fa-trash"></i>
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
}
