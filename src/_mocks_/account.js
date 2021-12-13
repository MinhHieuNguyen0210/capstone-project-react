// ----------------------------------------------------------------------
import Cookies from 'js-cookie';

const adminData = Cookies.get('adminData');

let data;
if (adminData !== undefined) {
  data = JSON.parse(adminData);
} else {
  data = {};
}
const { firstname, lastname, email } = data;

const account = {
  displayName: 'Shen Long',
  email: `${email}`,
  photoURL: '/static/mock-images/avatars/avatar_default.jpg'
};

export default account;
