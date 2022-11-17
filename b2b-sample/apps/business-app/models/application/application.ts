
export interface Application {
    id: "396a3c6e-4b5d-44d1-9449-d638b991c3bd",
    name: "temp",
    description: "Delegated access from: temp",
    [key: string]: any;
}

interface AllApplicaitonsApplication {
    id: "396a3c6e-4b5d-44d1-9449-d638b991c3bd",
    name: "temp",
    description: "Delegated access from: temp",
    [key: string]: any;
}

export interface AllApplications {
    totalResults: number,
    [key: string]: any,
    applications: [AllApplicaitonsApplication]
}
