export class Address {
  constructor(
    id,
    name,
    address,
    country,
    city,
    phoneCode,
    phoneNumber,
    isDefault,
    // latitude,
    // longitude,
    // state

  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.country = country;
    this.city = city;
    this.phoneCode = phoneCode;
    this.phoneNumber = phoneNumber;
    this.isDefault = parseInt(isDefault) === 1;
    // this.latitude = latitude;
    // this.longitude=longitude;
    // this.state= state;
  }
}
