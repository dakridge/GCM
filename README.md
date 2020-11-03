# GCM - Git Config Manager

This started out as a way for me to manage my git configurations between projects but can now handle any files defined in the environment config.

This is expected to run commands like:

```
gcm activate personal
gcm activate work
gcm envs
```

The way this works is that you can create environments inside the gcm directory.

```
$HOME/.gcm/envs/work
$HOME/.gcm/envs/personal
```

Each environment should have a `config.json` file that defines how the environment moves files around. Here is an example:

```json
{
    "files": [
        {
            "source": "ssh-config",
            "destination": "$HOME/.ssh/config"
        }
    ]
}
```