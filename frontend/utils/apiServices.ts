import axios from "axios";
export enum API_METHOD {
  GET = "get",
  POST = "post",
}
export const HEADER_APPLICATION_JSON = {
  "Content-Type": "application/json",
};
export const HTTP_SUCCESS_CODES = [200];

export const PRICE_API_BASE_URL = "https://fuse.codecrane.com/";
export const API_BASE_URL = "https://api.bob.codecrane.com/";
export const GET_TOKEN_PRICE = `${PRICE_API_BASE_URL}api/coin/bitcoin/price`;
export const GET_TX_STATUS = `${API_BASE_URL}api/tx/status/`;
export const ACCEPT_BTC_ORDER = `${API_BASE_URL}api/accept/order/`;

export const axiosInstance = axios.create();

export const getBtcPrice = (): Promise<any> => {
  const config = {
    method: API_METHOD.GET,
    url: GET_TOKEN_PRICE,
    headers: HEADER_APPLICATION_JSON,
  };
  return new Promise((resolve) => {
    axiosInstance(config)
      .then((res: any) => {
        if (HTTP_SUCCESS_CODES.includes(res.status)) {
          const {
            data: { data },
          } = res;
          resolve(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

export const getBtcBalance = (add: string): Promise<any> => {
  const config = {
    method: API_METHOD.GET,
    url: `https://api.bob.codecrane.com/api/bitcoin/${add}/balance/`,
    headers: HEADER_APPLICATION_JSON,
  };
  return new Promise((resolve) => {
    axiosInstance(config)
      .then((res: any) => {
        if (HTTP_SUCCESS_CODES.includes(res.status)) {
          const {
            data: { data },
          } = res;
          resolve(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

export const getTxStatus = (txHash: string): Promise<any> => {
  const config = {
    method: API_METHOD.POST,
    url: GET_TX_STATUS,
    headers: HEADER_APPLICATION_JSON,
    data: { tx_hash: txHash },
  }
  return new Promise((resolve) => {
    axiosInstance(config)
      .then((res: any) => {
        if (HTTP_SUCCESS_CODES.includes(res.status)) {
          const {
            data: { data },
          } = res;
          resolve(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

export const acceptBtcOrder = (
  btc_address: string,
  orderId: number
): Promise<any> => {
  const config = {
    method: API_METHOD.POST,
    url: ACCEPT_BTC_ORDER,
    headers: HEADER_APPLICATION_JSON,
    data: {
      order_id: orderId,
      btc_address: btc_address,
    },
  };
  return new Promise((resolve) => {
    axiosInstance(config)
      .then((res: any) => {
        if (HTTP_SUCCESS_CODES.includes(res.status)) {
          resolve(res);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

export const getOrderId = (txHash: string): Promise<any> => {
  const config = {
    method: API_METHOD.GET,
    url: `${API_BASE_URL}api/tx/${txHash}/order/`,
    headers: HEADER_APPLICATION_JSON,
  };
  return new Promise((resolve) => {
    axiosInstance(config)
      .then((res: any) => {
        if (HTTP_SUCCESS_CODES.includes(res.status)) {
          resolve(res);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });
};
