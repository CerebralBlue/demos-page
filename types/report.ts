export interface Report {
    _id: string;
    file_name: string;
    content: string;
    createdAt: string;
    versions?: Version[];
}

export interface Version {
    version: number;
    content: string;
    timestamp: string;
}