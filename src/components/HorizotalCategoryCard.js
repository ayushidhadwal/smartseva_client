import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {RFValue} from "react-native-responsive-fontsize";



const HorizotalCategoryCard = ({subCat,childCat,price})=>{
    return(
        <View style={styles.container}>
            <View style={styles.image}>
                <Image
                    style={styles.img}
                    source={require('../../assets/AC_repair.png')}
                />

            </View>
            <View style={{flex:4,margin:RFValue(12)}}>
                <Text>SubCategory</Text>
                <Text>ChildCategory</Text>
            </View>
            <View style={{flex:3}}>
                <Text style={{position:'absolute',bottom:5}}>Price:Rs 200</Text>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        // flex:1,
        backgroundColor:'pink',
        flexDirection:'row',
        height:100,
        width:'100%',
        marginBottom:RFValue(12),
        borderRadius:RFValue(5)

    },
    image:{
        height: 100,
        width:100,
       // borderRadius:RFValue(100)
    },
    img:{
        width:'100%',
        height:'100%',
        //borderRadius:RFValue(100),
        resizeMode:'cover'
    }


})

export default HorizotalCategoryCard