import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import {Divider, Title} from 'react-native-paper';
import {Row, Rows, Table} from 'react-native-table-component';

import Colors from '../constants/Colors';
import I18n from '../languages/I18n';

const InvoiceScreen = () => {
  const {serviceOrdered} = useSelector(state => state.request);

  const tableHead = [I18n.t('serviceTable'), I18n.t('totalTable')];
  const tableData = serviceOrdered.serviceDetails.map(m => [
    m.child_cat === null
      ? `${m.subcategory_name}`
      : `${m.subcategory_name} - ${m.child_cat}`,
    '₹  ' + m.st_service_price.toFixed(2),
  ]);

  // const wallet = parseFloat(
  //   serviceOrdered.booking_details.wallet_pay.replace(',', ''),
  // );

  return (
    <ScrollView style={styles.screen}>
      <Title style={styles.title}>
        {I18n.t('invoiceNo')} : #{serviceOrdered.booking_details.booking_id}
      </Title>
      {/* <View style={styles.card}>
        <Text style={[styles.bold, { fontSize: RFValue(14) }]}>
          {I18n.t('serviceProvide')}
        </Text>
        <Divider style={styles.marginVertical} /> */}
      {/*<TextRow*/}
      {/*  heading={"Store Name"}*/}
      {/*  desc={serviceOrdered.booking_details.company_name}*/}
      {/*/>*/}
      {/*<TextRow*/}
      {/*  heading={"Addess"}*/}
      {/*  desc={serviceOrdered.booking_details.address}*/}
      {/*/>*/}
      {/*<TextRow*/}
      {/*  heading={"Email"}*/}
      {/*  desc={serviceOrdered.booking_details.email}*/}
      {/*/>*/}
      {/*<TextRow*/}
      {/*  heading={"Contact No."}*/}
      {/*  desc={*/}
      {/*    serviceOrdered.booking_details.phone_code +*/}
      {/*    "-" +*/}
      {/*    serviceOrdered.booking_details.mobile*/}
      {/*  }*/}
      {/*/>*/}
      {
        /* <Text style={{ fontWeight: "bold" }}>
          {serviceOrdered.setting.application_name}
        </Text>
        <Text style={{ flexWrap: "wrap" }}>
          {serviceOrdered.setting.address}
      //   </Text>
      // </View> */
        <View style={styles.card}>
          <Text style={{fontWeight: 'bold'}}>
            {/*{serviceOrdered.setting.application_name}*/}
            SMARTSEVA
          </Text>
          <Text style={{flexWrap: 'wrap'}}>
            {serviceOrdered.setting.address}
          </Text>
        </View>
      }
      {/*<View style={[styles.card, {marginVertical: RFValue(10)}]}>*/}
      {/*  <Text style={[styles.bold, {fontSize: RFValue(14)}]}>*/}
      {/*    {I18n.t('custInfo')}*/}
      {/*  </Text>*/}
      {/*  <Divider style={styles.marginVertical} />*/}
      {/*  <TextRow*/}
      {/*    heading={I18n.t('name')}*/}
      {/*    desc={serviceOrdered.booking_details.user_name}*/}
      {/*  />*/}
      {/*  <TextRow*/}
      {/*    heading={I18n.t('mob')}*/}
      {/*    desc={serviceOrdered.booking_details.addr_phonenumber}*/}
      {/*  />*/}
      {/*  <TextRow*/}
      {/*    heading={I18n.t('address')}*/}
      {/*    desc={`${serviceOrdered.booking_details.addr_username}\n${serviceOrdered.booking_details.addr_address}*/}
      {/*      ${serviceOrdered.booking_details.addr_city}*/}
      {/*      ${serviceOrdered.booking_details.addr_country}`}*/}
      {/*  />*/}
      {/*</View>*/}
      <View style={[styles.card, {marginVertical: RFValue(10)}]}>
        <Text style={[styles.bold, {fontSize: RFValue(13)}]}>
          {I18n.t('serviceDesc')} :
        </Text>
        <Divider style={styles.marginVertical} />
        {/*<DataTable>*/}
        {/*  <DataTable.Header>*/}
        {/*    <DataTable.Title>Service Name</DataTable.Title>*/}
        {/*    <DataTable.Title numeric>Price</DataTable.Title>*/}
        {/*    <DataTable.Title numeric>Qty</DataTable.Title>*/}
        {/*    <DataTable.Title numeric>Service Price</DataTable.Title>*/}
        {/*  </DataTable.Header>*/}
        {/*  {serviceOrdered.serviceDetails.map((i, index) => (*/}
        {/*    <DataTable.Row key={index}>*/}
        {/*      <DataTable.Cell>{i.subcategory_name}</DataTable.Cell>*/}
        {/*      <DataTable.Cell numeric>AED {i.st_service_price}</DataTable.Cell>*/}
        {/*      <DataTable.Cell numeric>{i.st_qty}</DataTable.Cell>*/}
        {/*      <DataTable.Cell numeric>*/}
        {/*        {i.st_service_price * i.st_qty}*/}
        {/*      </DataTable.Cell>*/}
        {/*    </DataTable.Row>*/}
        {/*  ))}*/}
        {/*</DataTable>*/}
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={tableData} textStyle={styles.text} />
          <Row
            data={[
              'Convenience Fee',
              `+ ₹${serviceOrdered.booking_details.vat_amount}`,
            ]}
            textStyle={styles.text}
          />
          <Row
            data={
              serviceOrdered.booking_details.additional_price > 0
                ? [
                    serviceOrdered.booking_details.job_completed_comment,
                    `+₹${serviceOrdered.booking_details.additional_price}`,
                  ]
                : null
            }
            textStyle={styles.text}
          />
          <Row
            data={[
              'Total Amount',
              `₹${serviceOrdered.booking_details.final_service_price}`,
            ]}
            style={[styles.head]}
            textStyle={[styles.text]}
          />
        </Table>
        <Divider />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  title: {
    color: Colors.primary,
    textAlign: 'center',
    paddingVertical: RFValue(10),
  },
  marginVertical: {
    marginVertical: RFValue(5),
  },
  bold: {
    fontWeight: 'bold',
  },
  card: {
    padding: RFValue(12),
    backgroundColor: 'white',
  },
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6, fontSize: RFValue(11), textAlign: 'center'},
  row: {height: 28},
});

export default InvoiceScreen;
