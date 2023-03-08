## @openchair-io/secrets-manager

Simple CLI to pull secrets from AWS Secrets Manager and output them into `.env` format for AWS Secrets Manager type: `Other type of secret`.

![Other type of secret](/assets/image1.png)

### Install

We recommend that you install it at the global npm level so that you can use it wherever, but obviously feel free to install it at the package level.

```
npm i -g @openchair-io/secrets-manager
```

### Usage
<br>
See available options and what they do.

```
oc secrets --help
```
<br>

Fetch secrets and output to `./.env`.

```
export AWS_ACCESS_KEY_ID=xxxx
export AWS_SECRET_ACCESS_KEY=xxx

oc secrets <aws secrets manager secret name>

```
This will create a `.env` file in the directory you run it in that looks like:

```
SECRET_1=xxxx
SECRET_2=xxxx
```
<br>

Fetch secrets and output to a different path i.e. `./.env.development`.

```
export AWS_ACCESS_KEY_ID=xxxx
export AWS_SECRET_ACCESS_KEY=xxx

oc secrets <aws secrets manager secret name> --path .env.development

```
This will create an env file at `./.env.development` file that looks like:

```
SECRET_1=xxxx
SECRET_2=xxxx
```
<br>

Fetch secrets and output to a different path i.e. `~/desktop/.env.development` .

```
export AWS_ACCESS_KEY_ID=xxxx
export AWS_SECRET_ACCESS_KEY=xxx

oc secrets <aws secrets manager secret name> --path .env.development

```
This will create an env file at `~/desktop/.env.development` file that looks like:

```
SECRET_1=xxxx
SECRET_2=xxxx
```
<br>

Fetch secrets and prepend `export`.

```
export AWS_ACCESS_KEY_ID=xxxx
export AWS_SECRET_ACCESS_KEY=xxx

oc secrets <aws secrets manager secret name> --prepend 'export '

```
This will create an env file at `./.env` file that looks like:

```
export SECRET_1=xxxx
export SECRET_2=xxxx
```
<br>