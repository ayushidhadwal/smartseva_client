import {
  GET_SERVICE_PROVIDER,
  GET_BOOKING,
  GET_SERVICE_PROVIDER_REVIEW,
  GET_SERVICE_PROVIDER_PROFILE,
  REQUEST_SERVICE,
  PAY_ORDER_DETAILS,
  GET_COMPLETED_REQUEST,
  CANCEL_REQUEST,
  GET_PAYMENT_AMOUNT,
  PICTURES_OF_BOOKING,
  GET_ORDER_DETAILS,
  GET_PENDING_REQ,
  GET_PENDING_REQ_DETAIL,
  CART_CHECKOUT,
  GET_COMPLAINT_TYPES,
} from '../actions/request';

const initialState = {
  service_provider: [],
  bookingList: [],
  pendingList: [],
  pendingReqDetail: [],
  providerReview: [],
  providerProfile: {
    services: [],
    service_pricing: [],
    behaviour_rating: 0,
    value_for_money_rating: 0,
    service_rating: 0,
    total_rating: 0,
    gallery: [],
    profile: {
      partner_id: '',
      company_name: '',
      photo: '',
      overview: '',
    },
  },
  completedRequest: [],

  // order details
  payOrderDetails: {
    booking: {
      id: null,
      booking_id: '',
      booking_date: '',
      booking_time: '',
      service_price: '',
      final_service_price: '',
    },
    serviceDetails: [],
    wallet: '',
    total: '',
    payableWall: null,
    vat: '',
    cardpay: '',
    vatPercent: '',
    walletPercent: '',
    refund_wallet: '',
  },
  paymentAmountDetails: {
    card_pay: '',
    payable_amount: '',
    point_wallet: '',
    points_pay: '',
    refund_wallet: '',
    serviceDetails: [],
    total_amount: '',
    total_price: '',
    vat: '',
    vat_percent: '',
    wallet_pay: '',
  },
  subService_provider: {
    id: 0,
    service_id: 0,
    image: '',
    subcategory_name: '',
  },
  pictures: {
    date: '',
    description: '',
    images: [],
    time: '',
  },
  serviceOrdered: {
    booking_details: {
      booking_id: '',
      booking_date: '',
      booking_time: '',
      service_price: null,
      final_service_price: '',
      total_price: null,
      price_paid: null,
      wallet_pay: null,
      vat_amount: '',
      message: null,
      service_id: null,
      qty: null,
      vendor_id: 0,
      status: '',
      payment_status: '',
      rejected_by: '',
      refund_status: '',
      job_completed_comment: null,
      confirm_status: '',
      confirm_reason: null,
      reason: null,
      address_id: 0,
      addr_username: '',
      addr_address: '',
      addr_country: '',
      addr_city: '',
      addr_phonenumber: '',
      booking_comment: null,
      service_name: '',
      review_status:'',
      reject_reason:''
    },
    serviceDetails: [],
    serviceConfirmation: [],
    complaints: {
      cr_subject: '',
      cr_comment: '',
      feedback: '',
    },
    setting: {
      application_name: '',
      address: '',
    },
    payData: {
      price: '',
      total: '',
      tax: '',
      subservice: {
        subcategory_name: '',
        child_cat: '',
      },
      inputData: {
        service: '',
        sub_service: '',
        date: '',
        time: '',
        user_id: '',
        qty: '',
        address_id: '',
      },
      razor: {
        id: '',
        entity: '',
        amount: '',
        amount_paid: '',
        amount_due: '',
        currency: '',
        receipt: '',
        offer_id: null,
        status: '',
        attempts: '',
        notes: [],
        created_at: '',
      },
    },
    gst_amount: '',
    gst_percent: '',
    additional_price: '',
    total_amount: '',
    razorpayOrderId: '',
  },
  razorpay: {
    orderId: '',
    amount: '',
  },
  complaintList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SERVICE_PROVIDER: {
      const data = action.payData;
      return {
        ...state,
        payData: {
          ...state.payData,
          price: data.price,
          total: data.total,
          tax: data.tax,
          subservice: {...data.subservice},
          inputData: {...data.inputData},
          razor: {...data.razor},
        },
      };
    }
    case GET_BOOKING: {
      return {
        ...state,
        bookingList: [...action.bookingList],
      };
    }
    case GET_PENDING_REQ: {
      return {
        ...state,
        pendingList: [...action.pendingList],
      };
    }
    case GET_PENDING_REQ_DETAIL: {
      return {
        ...state,
        pendingReqDetail: [...action.pendingReqDetail],
      };
    }

    case CANCEL_REQUEST: {
      const bookingLists = [...state.bookingList];
      const booking_id = action.booking_id;
      const i = bookingLists.findIndex(obj => obj.booking_id === booking_id);

      if (i > -1) {
        bookingLists[i] = {
          ...bookingLists[i],
          service_status: 'CANCELLED',
        };
      }

      return {
        ...state,
        bookingList: bookingLists,
      };
    }
    case REQUEST_SERVICE: {
      return {
        ...state,
        bookingId: action.bookingId,
      };
    }
    case GET_SERVICE_PROVIDER_REVIEW: {
      return {
        ...state,
        providerReview: [...action.providerReview],
      };
    }
    case GET_COMPLETED_REQUEST: {
      return {
        ...state,
        completedRequest: [...action.completedRequest],
      };
    }
    case GET_SERVICE_PROVIDER_PROFILE: {
      const data = action.providerProfile;
      return {
        ...state,
        providerProfile: {
          services: data.services,
          service_pricing: data.service_pricing,
          behaviour_rating: data.behaviour_rating,
          value_for_money_rating: data.value_for_money_rating,
          service_rating: data.service_rating,
          total_rating: data.total_rating,
          gallery: data.gallery,
          profile: data.profile,
        },
      };
    }
    case PAY_ORDER_DETAILS: {
      const data = action.payOrderDetails;
      return {
        ...state,
        payOrderDetails: {
          booking: data.booking,
          serviceDetails: data.serviceDetails,
          wallet: data.wallet,
          total: data.total,
          payableWall: data.payableWall,
          vat: data.vat,
          cardpay: data.cardpay,
          vatPercent: data.vatPercent,
          walletPercent: data.walletPercent,
          refund_wallet: data.refund_wallet,
        },
      };
    }
    case GET_PAYMENT_AMOUNT: {
      const data = action.paymentAmountDetails;
      return {
        ...state,
        paymentAmountDetails: {
          card_pay: parseFloat(data.card_pay.replace(',', '')),
          payable_amount: parseFloat(data.payable_amount.replace(',', '')),
          point_wallet: data.point_wallet,
          points_pay: data.points_pay,
          refund_wallet: data.refund_wallet,
          serviceDetails: data.serviceDetails,
          total_amount: parseFloat(data.total_amount.replace(',', '')),
          total_price: data.total_price,
          vat: parseFloat(data.vat.replace(',', '')),
          vat_percent: parseFloat(data.vat_percent.replace(',', '')),
          wallet_pay: data.wallet_pay,
        },
      };
    }
    case PICTURES_OF_BOOKING: {
      const data = action.pictures;
      return {
        ...state,
        pictures: {
          date: data.date,
          description: data.description,
          images: data.images,
          time: data.time,
        },
      };
    }
    case GET_ORDER_DETAILS: {
      return {
        ...state,
        serviceOrdered: {
          booking_details: {
            ...action.serviceOrdered.booking_details,
          },
          setting: {
            ...action.serviceOrdered.setting,
          },
          serviceDetails: [...action.serviceOrdered.serviceDetails],
          serviceConfirmation: [...action.serviceOrdered.serviceConfirmation],
          complaints: {
            ...action.serviceOrdered.complaints,
          },
          gst_amount: action.serviceOrdered.gst_amount,
          gst_percent: action.serviceOrdered.gst_percent,
          additional_price: action.serviceOrdered.additional_price,
          total_amount: action.serviceOrdered.booking_details.final_service_price,
          razorpayOrderId: action.razorpay,
        },
      };
    }
    case CART_CHECKOUT: {
      return {
        ...state,
        razorpay: {
          orderId: action.razor.orderId,
          amount: action.razor.amount,
        },
      };
    }

    case GET_COMPLAINT_TYPES: {
      return {
        ...state,
        complaintList: action.complaintList,
      };
    }

    default:
      return state;
  }
};
