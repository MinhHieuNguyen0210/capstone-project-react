// import { useFormik } from 'formik';
// import { useState, useEffect } from 'react';
// // material
// import { Container, Stack, Typography } from '@material-ui/core';
// // components
// import Page from '../components/Page';
// import {
//   ProductSort,
//   ProductList,
//   ProductCartWidget,
//   ProductFilterSidebar
// } from '../components/_dashboard/products';
// //
// import PRODUCTS from '../_mocks_/products';
// // ----------------------------------------------------------------------
// export default function EcommerceShop() {
//   const [openFilter, setOpenFilter] = useState(false);
//   const formik = useFormik({
//     initialValues: {
//       gender: '',
//       category: '',
//       colors: '',
//       priceRange: '',
//       rating: ''
//     },
//     onSubmit: () => {
//       setOpenFilter(false);
//     }
//   });
//   const { resetForm, handleSubmit } = formik;
//   const [productList, setProductList] = useState([]);
//   useEffect(() => {
//     async function fetchProductList() {
//       const requestUrl = 'https://foody-store-server.herokuapp.com/products';
//       const response = await fetch(requestUrl);
//       const responseJSON = await response.json();
//       console.log({ responseJSON });
//       const data = responseJSON;
//       setProductList(data);
//     }
//     fetchProductList();
//   }, []);
//   return (
//     <Page title="Dashboard: Products | Admin">
//       <Container>
//         <Typography variant="h3" sx={{ mb: 5 }}>
//           Product list
//         </Typography>
//         <ProductList products={productList} />
//         <ProductCartWidget />
//       </Container>
//     </Page>
//   );
// }
