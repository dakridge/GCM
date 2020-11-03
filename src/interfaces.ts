export interface Paths {
    config: string,
    environments: string,
}

export interface FileConfiguration {
    source: string,
    destination: string,
}

export interface Environment {
    name: string,
    path: string,
    isActive: boolean,
    config: {
        files: FileConfiguration[],
    },
}

export interface Configuration {
    active: string,
}