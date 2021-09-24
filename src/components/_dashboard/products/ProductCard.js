// material
import { Box, Card, Link, Stack, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object
};

export default function ShopProductCard({ product }) {
  const { _id, name, description, quantity } = product;

  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap color="#00AB55">
            ID:
            <span style={{ color: 'black' }}> {_id}</span>
          </Typography>
          <Typography variant="subtitle2" noWrap color="orange">
            Product name:
            <span style={{ color: 'black' }}> {name}</span>
          </Typography>
          <Typography variant="subtitle2" noWrap color="orange">
            Description:
            <span style={{ color: 'black' }}> {description}</span>
          </Typography>
          <Typography variant="subtitle2" noWrap color="orange">
            Quantity:
            <span style={{ color: 'black' }}> {quantity}</span>
          </Typography>
        </Link>
      </Stack>
      <Box>
        <ProductImgStyle src="../static/mock-images/products/product_13.jpg" />
      </Box>
    </Card>
  );
}
