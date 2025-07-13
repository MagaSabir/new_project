export class CrateBlogDto {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string
    ) {}
}

export class UpdateBlogDto {
    constructor(
        public name: string,
        public description: string,
        public websiteUrl: string
    ) {}
}