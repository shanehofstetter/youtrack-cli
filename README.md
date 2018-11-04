# youtrack-cli
Command Line Tool for interacting with youtrack


## Install
```
npm install -g youtrack-cli
```
```
yarn add youtrack-cli
```


## Usage

After you installed the package globally, the command `youtrack` will be available.

### Getting started

To setup the cli (set the URL, provide your credentials) run:
```bash
$ youtrack setup
```
This will guide you through the setup process.

### Commands

```
youtrack -h
```

Available commands are:

```
project|p      manage projects
user|u         manage users
setup          setup youtrack cli
```


#### Projects

```
$ youtrack project <subcommand> <options>
```

Available subcommands:

```
list|ls [options]  list all accessible projects
```


##### list

```
Options:
  -r, --raw   print raw json
  -d, --desc  print description (does not apply when option --raw is used
```

Example:  

```bash
$ youtrack project ls
```

```
┌─────────────────┬────────────────┐
│ shortName       │ name           │
├─────────────────┼────────────────┤
│ MP              │ myotherproject │
├─────────────────┼────────────────┤
│ T1              │ test 1         │
└─────────────────┴────────────────┘

```

#### Users

```
$ youtrack user <subcommand> <options>
```

Available subcommands:

```
info|i [options]        show info about current user
show [options] <login>  show info about user
```

