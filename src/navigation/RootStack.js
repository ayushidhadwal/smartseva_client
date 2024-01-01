import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import I18n from 'i18n-js';

import Colors from '../constants/Colors';
import BottomTabs from './BottomTabs';
import SubCategoriesScreen, {
  screenOptions as subCategoriesScreenOptions,
} from '../screen/SubCategoryScreen';
import SlotBookingScreen, {
  screenOptions as slotBookingScreenOptions,
} from '../screen/SlotBookingScreen';
import WalletScreen, {
  screenOptions as walletScreenOptions,
} from '../screen/ProfileSection/WalletScreen';
import ServiceProvidersScreen, {
  screenOptions as serviceProvidersScreenOptions,
} from '../screen/booking/ServiceProvidersScreen';

import PaymentOption from '../screen/ProfileSection/PaymentOption';
import Security from '../screen/ProfileSection/Security';
import ReviewScreen from '../screen/ProfileSection/RateUsScreen';
import CartScreen from '../screen/CartScreen';
import EditProfileScreen from '../screen/ProfileSection/EditProfileScreen';
import AboutUs from '../screen/ProfileSection/AboutUs';
import HelpScreen from '../screen/ProfileSection/HelpScreen';
import DetailScreen from '../screen/DetailScreen';
import PostReviewScreen from '../screen/PostReviewScreen';
import RequestDetailScreen from '../screen/RequestDetailScreen';
import ProviderReviewScreen from '../screen/ProviderReviewScreen';
import OrderPageScreen from '../screen/OrderPageScreen';
import ServiceList from '../screen/ProfileSection/ServiceList';
import WalletTransaction from '../screen/WalletTransaction';
import Complaintform from '../screen/ProfileSection/Complaintform';
import AllServiceScreen from '../screen/AllServiceScreen';
import PaymentScreen from '../screen/PaymentScreen';
import SendBookingRequestScreen, {
  screenOptions as sendBookingRequestScreenOptions,
} from '../screen/booking/SendBookingRequestScreen';
import AddressBookScreen, {
  screenOptions as addressBookScreenOptions,
} from '../screen/address/AddressBookScreen';
import EditAddressScreen, {
  screenOptions as editAddressScreenOptions,
} from '../screen/address/EditAddressScreen';
import NewAddressScreen, {
  screenOptions as newAddressScreenOptions,
} from '../screen/address/NewAddressScreen';
import AddressListScreen from '../screen/AddressListScreen';
import ServiceConfirmationScreen from '../screen/ServiceConfirmationScreen';
import PayForServiceScreen from '../screen/PayForServiceScreen';
import InvoiceScreen from '../screen/InvoiceScreen';
import MessageScreen, {
  screenOptions as messageScreenOptions,
} from '../screen/MessageScreen';
import PaymentMethodScreen from '../screen/PaymentMethodScreen';
import PendingRequestDetailScreen from '../screen/ProfileSection/PendingRequestDetailScreen';
import RechargeScreen from '../screen/RechargeScreen';
import MapScreen from '../screen/address/MapScreen';
import ChangeLocationScreen from '../screen/address/ChangeLocationScreen';

const Stack = createNativeStackNavigator();

const stackOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTintColor: '#fff',
  headerBackTitle: null,
  headerBackTitleVisible: false,
};

const routes = [
  {
    name: 'BottomTabs',
    component: BottomTabs,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'NewAddress',
    component: NewAddressScreen,
    options: newAddressScreenOptions,
  },
  {
    name: 'AddressBook',
    component: AddressBookScreen,
    options: addressBookScreenOptions,
  },
  {
    name: 'EditAddress',
    component: EditAddressScreen,
    options: editAddressScreenOptions,
  },
  {
    name: 'SubCategories',
    component: SubCategoriesScreen,
    options: subCategoriesScreenOptions,
  },
  {
    name: 'SlotBooking',
    component: SlotBookingScreen,
    options: slotBookingScreenOptions,
  },
  {
    name: 'ServiceProviders',
    component: ServiceProvidersScreen,
    options: serviceProvidersScreenOptions,
  },
  {
    name: 'SendBookingRequest',
    component: SendBookingRequestScreen,
    options: sendBookingRequestScreenOptions,
  },
  {
    name: 'Wallet',
    component: WalletScreen,
    options: walletScreenOptions,
  },
  {
    name: 'message',
    component: MessageScreen,
    options: messageScreenOptions,
  },
];

const RootStack = () => (
  <Stack.Navigator screenOptions={stackOptions}>
    {routes.map(({name, component, options}) => (
      <Stack.Screen name={name} component={component} options={options} />
    ))}
    <Stack.Screen
      name="Payment"
      component={PaymentOption}
      options={{
        title: 'Manage Payment Methods',
      }}
    />
    <Stack.Screen
      name="AddressList"
      component={AddressListScreen}
      options={{
        title: I18n.t('chooseAddress'),
      }}
    />
    <Stack.Screen
      name="Password"
      component={Security}
      options={{
        title: I18n.t('updPass'),
      }}
    />
    <Stack.Screen
      name="Review"
      component={ReviewScreen}
      options={{
        title: I18n.t('feedback'),
      }}
    />
    <Stack.Screen
      name="Cart"
      component={CartScreen}
      options={{
        title: 'Cart',
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        title: I18n.t('editProfile'),
      }}
    /> 
    {/*<Stack.Screen*/}
    {/*  name="OrderDetail"*/}
    {/*  component={OrderDetailScreen}*/}
    {/*  options={{*/}
    {/*    title: "Order Details",*/}
    {/*  }}*/}
    {/*/>*/}
     <Stack.Screen
      name="about"
      component={AboutUs}
      options={{
        title: I18n.t('aboutUs'),
      }}
    />
    <Stack.Screen
      name="help"
      component={HelpScreen}
      options={{
        title: I18n.t('urgentService'),
      }}
    />

    <Stack.Screen
      name="Detail"
      component={DetailScreen}
      options={{
        title: I18n.t('serviceProviderProfile'),
      }}
    />
    <Stack.Screen
      name="PostReview"
      component={PostReviewScreen}
      options={{
        title: I18n.t('revScreenTitle'),
      }}
    />
    <Stack.Screen
      name="RequestDetails"
      component={RequestDetailScreen}
      options={{
        title: I18n.t('reqDetails'),
      }}
    />
    <Stack.Screen
      name="ProviderReview"
      component={ProviderReviewScreen}
      options={{
        title: I18n.t('serviceProviderRev'),
      }}
    />
    <Stack.Screen
      name="Order"
      component={OrderPageScreen}
      options={{
        title: I18n.t('bookDetails'),
      }}
    />
    <Stack.Screen
      name="ServiceList"
      component={ServiceList}
      options={{
        title: I18n.t('raiseComplaint'),
      }}
    />
    <Stack.Screen
      name="walletActivity"
      component={WalletTransaction}
      options={{
        title: I18n.t('walletTrans'),
      }}
    />
    <Stack.Screen
      name="AllService"
      component={AllServiceScreen}
      options={{
        title: I18n.t('searchTitle'),
      }}
    />
    <Stack.Screen
      name="Complaintform"
      component={Complaintform}
      options={{
        title: I18n.t('raiseComplaint'),
      }}
    />
    <Stack.Screen
      name="OnlinePayment"
      component={PaymentScreen}
      options={{
        title: I18n.t('onlinePayment'),
      }}
    />
    <Stack.Screen
      name="PayForService"
      component={PayForServiceScreen}
      options={{
        title: I18n.t('payForService'),
      }}
    />
    <Stack.Screen
      name="serviceConfirmation"
      component={ServiceConfirmationScreen}
      options={{
        title: I18n.t('serviceConf'),
      }}
    />
    <Stack.Screen
      name="invoice"
      component={InvoiceScreen}
      options={{
        title: I18n.t('invoiceBtn'),
      }}
    />
    <Stack.Screen
      name="paymentMethod"
      component={PaymentMethodScreen}
      options={{
        title: 'Payment Methods',
      }}
    />
    <Stack.Screen
      name="paymentDetailMethod"
      component={PendingRequestDetailScreen}
      options={{
        title: 'Pending Request Detail',
      }}
    />
    <Stack.Screen
      name="Recharge"
      component={RechargeScreen}
      options={{
        title: 'Recharge Your Wallet',
      }}
    />
    <Stack.Screen
      name="Map"
      component={MapScreen}
      options={{headerTitle: 'Choose Delivery Location'}}
    />
    <Stack.Screen
      name="changeLocation"
      component={ChangeLocationScreen}
      options={{headerTitle: 'Select Your Location'}}
    /> 
  </Stack.Navigator>
);

export default RootStack;
