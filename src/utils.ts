
export interface ApiResult {
    code: number;
    message: string;
}

export class ApiResults {

   static OK(): ApiResult { return { code: 200, message: "success"}; }

   static PARAM_ERROR(message: string = "parameters not correct"): ApiResult  { return { code: 5001, message}; }
   static SIGNATURE_ERROR(message: string = "signature not match"): ApiResult { return { code: 5002, message}; }
   static DB_ERROR(message: string = "db error"): ApiResult { return { code: 5003, message}; }
   static WALLET_NOT_BIND(message: string = "wallet is not bound"): ApiResult { return { code: 5004, message}; }
   static WALLET_BOUND(message: string = "wallet has been bound"): ApiResult { return { code: 5005, message}; }

}