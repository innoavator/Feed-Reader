namespace java P3Client

struct Data {
    1: string key,             /* The item description*/
    2: string value            /* The value , representing the user's interest */
}

service P3ClientService {
      i32 sendData(1: list<Data> data, 2: string appId, 3: string appSecret)
}
