export type BlogType = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string
  isMembership: boolean
};

export type DataReqBodyType = {
  name: string;
  description: string;
  websiteUrl: string;
}

export type ErrorMessageType = {
  message: string;
  field: string;
};

