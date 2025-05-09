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

export type BlogQuery = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 1 | -1;
  searchNameTerm?: string;
}

