// const CODBtn = document.getElementById('COD');
// const cardBtn = document.getElementById('Card');
// const dailyBtn = document.getElementById('today');
// const weeklyBtn = document.getElementById('week')
// const monthlyBtn = document.getElementById('month');
// const yearlyBtn = document.getElementById('year')
// const dateForm = document.getElementById('dateForm')
// const paymentMethodBtns = document.querySelectorAll('.payment-method-btn');
// let dataTable;

// const templateString = `
// <table class="table table-striped" id="salesReport">
//   <thead>
//     <tr>
//       <th scope="col">Date</th>
//       <th scope="col">Order ID</th>
//       <th scope="col">Buyer</th>
//       <th scope="col">Product Name</th>
//       <th scope="col">Category</th>
//       <th scope="col">Quantity</th>
//       <th scope="col">Total</th>
//       <th scope="col">Payment Method</th>
//     </tr>
//   </thead>
//   <tbody class="table-group-divider">
//   <% salesReport.forEach(order => { %>
//     <tr>
//       <td><%= order.orderDate %></td>
//       <td>ODR<%= order._id.toString().slice(-4) %></td>
//       <td><%= order.userId %></td>
//       <td><%= order.items[0].productId %></td>
//       <td><%= order.items[0].productCategory %></td>
//       <td><%= order.items[0].qty %></td>
//       <td><%= order.totalAmt %></td>
//       <td><%= order.paymentMethod %></td>
//     </tr>
//   <% }); %>

//   </tbody>

// </table>
// `

// function generateTemplate(salesReport) {
//     const template = ejs.compile(templateString);
//     const html = template({ salesReport: salesReport });
//     document.querySelector('#salesReport').innerHTML = html;

//     dataTable.destroy();
//     dataTable = new DataTable('#salesReport');
// }

// $(document).ready(() => {
//   dataTable = new DataTable('#salesReport');
// });

// paymentMethodBtns.forEach(btn => {
//   btn.addEventListener('click', (e) => {
//     paymentMethodBtns.forEach(b => b.classList.remove('active'));
//     e.currentTarget.classList.add('active');
//   });
// });

// CODBtn.addEventListener('click', () => {
//   fetch('/admin/salesreport/COD', { method: 'get' })
//     .then(response => response.json())
//     .then(response => generateTemplate(response));
// });

// cardBtn.addEventListener('click', () => {
//   fetch('/admin/salesreport/Card', { method: 'get' })
//     .then(response => response.json())
//     .then(response => generateTemplate(response));
// });

// dailyBtn.addEventListener('click', () => {
//   const startDate = findStartDate(1);
//   fetch(`/admin/dated-sales-report?startDate=${startDate}&endDate=${new Date()}`, { method: 'get' })
//     .then(response => response.json())
//     .then(response => generateTemplate(response));
// });

// weeklyBtn.addEventListener('click', () => {
//   const startDate = findStartDate(7);
//   fetch(`/admin/dated-sales-report?startDate=${startDate}&endDate=${new Date()}`, { method: 'get' })
//     .then(response => response.json())
//     .then(response => generateTemplate(response));
// });

// monthlyBtn.addEventListener('click', () => {
//   const startDate = findStartDate(30);
//   fetch(`/admin/dated-sales-report?startDate=${startDate}&endDate=${new Date()}`, { method: 'get' })
//     .then(response => response.json())
//     .then(response => generateTemplate(response));
// });

// yearlyBtn.addEventListener('click', () => {
//   const startDate = findStartDate(365);
//   fetch(`/admin/dated-sales-report?startDate=${startDate}&endDate=${new Date()}`, { method: 'get' })
//     .then(response => response.json())
//     .then(response => generateTemplate(response));
// });

// dateForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   let startDate = dateForm.startDate.value;
//   let endDate = dateForm.endDate.value;
//   const selectedPaymentMethodBtn = document.querySelector('.payment-method-btn.active');
//   let selectedPaymentMethod = '';

//   if (selectedPaymentMethodBtn) {
//     selectedPaymentMethod = selectedPaymentMethodBtn.id;
//   }

//   if (startDate === '' || endDate === '') {
//     document.querySelector('#dateErr').innerHTML = 'Please select Date';
//   } else {
//     startDate = new Date(startDate);
//     endDate = new Date(endDate);

//     if (startDate >= endDate) {
//       document.querySelector('#dateErr').innerHTML = 'Please check your selected Date';
//     } else {
//       let fetchURL = `/admin/dated-sales-report?startDate=${startDate}&endDate=${new Date()}`;

//       if (selectedPaymentMethod) {
//         fetchURL += `&paymentMethod=${selectedPaymentMethod}`;
//       }

//       fetch(fetchURL, { method: 'get' })
//         .then(response => response.json())
//         .then(response => generateTemplate(response));
//     }
//   }
// });

// document.getElementById('downloadPdf').addEventListener('click', function () {
//   doc.text('SALES REPORT', 20, 20);
//   doc.autoTable({ html: '#salesReport', margin: { top: 40 } });
//   doc.save('sales_report.pdf');
// });

// function findStartDate(days) {
//   const startDate = new Date();
//   startDate.setDate(startDate.getDate() - days);
//   return startDate;
// }
