// Standard Library
import { parse } from "https://deno.land/std/flags/mod.ts";
import { red, green, blue, bold, yellow, white } from "https://deno.land/std/fmt/colors.ts";

// Functions
import { createSpaces } from './utils.ts';
import { initialize, getEnvironments, setActiveEnvironment } from './functions.ts';

const { args } = Deno;

(async function() {
    const parsedArgs = parse(args);
    const command = parsedArgs._[0];

    switch(command) {
        case 'initialize': {
            console.log( bold('Initializing GCM.') );
            await initialize();
            break;
        }

        case 'activate': {
            const environmentName = parsedArgs._[1].toString();
            await setActiveEnvironment(environmentName);
            console.log(white(`Changing active environment to`), bold(`${environmentName}`));
            break;
        }

        case 'envs': {
            const environments = await getEnvironments();
            console.log(yellow(bold('--- GCM Environments ---\n' )));

            environments.forEach(environment => {
                console.log(bold(`${environment.isActive ? '*' : ' '} ${environment.name} ${createSpaces(20 - environment.name.length)}`), `${environment.path}` );
            });

            break;
        }
    }
})();