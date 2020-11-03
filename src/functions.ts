import "https://deno.land/x/dotenv/load.ts";
import { walk, walkSync, ensureDir, ensureFile } from "https://deno.land/std@0.76.0/fs/mod.ts";

// interfaces
import { createSpaces, readJson } from './utils.ts';
import { Environment, Paths, FileConfiguration, Configuration } from './interfaces.ts'

const getPaths = () => {
    const homeDirectory = Deno.env.get("HOME");

    const paths: Paths = {
        config: `${homeDirectory}/.gcm/config.json`,
        environments: `${homeDirectory}/.gcm/envs/`,
    };

    return paths;
}

const getConfig = async () => {
    const paths = getPaths();
    let configAsText: string = '';

    try {
        configAsText = await Deno.readTextFile(paths.config);
    }
    catch(ermahgerd) {
        configAsText = '';
    }

    let configAsJson: Configuration = {
        active: '',
    };
    
    try {
        configAsJson = JSON.parse(configAsText);
    }
    catch(ermahgerd) {
        // pass
    }

    return configAsJson;
};

const getActiveEnvironment = async () => {
    const config = await getConfig();
    return config.active;
}

export const getEnvironments = async () => {
    const paths = getPaths();
    const envsPath = paths.environments;
    const activeEnvironment = await getActiveEnvironment();

    // create directory if it doesn't exist
    await ensureDir(envsPath);

    let availableEnvironments: Environment[] = [];
    for (const entry of walkSync(envsPath)) {

        const path = entry.path;
        const name = entry.path.slice(envsPath.length);

        let config = null;
        try {
            config = await readJson(`${entry.path}/config.json`);
        }
        catch(ermahgerd) {
            // pass
        }

        if(config) {
            const environment: Environment = {
                name: name,
                path: entry.path,
                isActive: name === activeEnvironment,
                config: config,
            };

            availableEnvironments.push(environment);
        }
    }

    return availableEnvironments;
}

const getEnvironmentByName = async (name:string) => {
    const environments = await getEnvironments();
    const foundEnvironment = environments.find(environment => environment.name === name);

    return foundEnvironment;
}

const moveFiles = async (environment:Environment) => {
    const files = environment.config.files;

    const copies = files.map(file => {
        const destination = `${file.destination}`
        const source = `${environment.path}/${file.source}`;

        return Deno.copyFile(source, destination);
    });

    await Promise.all(copies);
}

export const setActiveEnvironment = async (name:string) => {
    const paths = getPaths();
    const config = await getConfig();
    const environment = await getEnvironmentByName(name);

    if(!environment) {
        console.log( `No valid environment found by the name ${name}` );
        return;
    }

    moveFiles(environment);

    // update config
    config.active = name

    // write to disk
    const encoder = new TextEncoder();
    try {
        await Deno.writeFile(
            paths.config, 
            encoder.encode(JSON.stringify(config, null, 2)),
        );
    }
    catch(ermahgerd) {
        console.log( ermahgerd );
    }
}

export const printEnvironments = async () => {
    const environments = await getEnvironments();

    console.log( '--- GCM Environments ---' );
    console.log( '' );

    environments.forEach(environment => {
        console.log( `${environment.name} ${createSpaces(20 - environment.name.length)} ${environment.isActive ? '*' : ' '} ${environment.path}` );
    });
}

export const initialize = async () => {
    const paths = getPaths();
    await ensureFile(paths.config);
}