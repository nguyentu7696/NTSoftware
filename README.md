# NTSoftware
# Đồ án tốt nghiệp Fithou của Lê Hồng Ngọc và Nguyễn Anh Tú năm 2019

## install in ubuntu 18.04

1. **Mono**

2. **Dotnet core 2.2.402**

3. **Nodejs**

4. **Angular 8**

5. **MSSQL (SQL Server 2017)**

6. **JetBrains Rider**



## Steps to Setup the .NET Core Back end app (NTSoftware)

1. **Clone the application**

2. **Change MSSQL username and password as per your MSSQL installation**
  + open `NTSoftware/NTSoftware/appsettings.json` file.
  + change `DefaultConnection` properties as per your MSSQL installation: `Server=localhost;Database=NTSoftwarePB;User Id=sa;Password=YOURPASSWORD;MultipleActiveResultSets=true`or `Data Source=YOURSERVERADDRESS;Initial Catalog=NTSoftware;Integrated Security=True`
  
4. **Run Migrations using .NET Core CLI**
 
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```
5. **Run App**



## Steps to Setup the Angular Front end app (NTSoftware/NTSoftware/ClientApp)
First go to the `ClientApp` folder -

```bash
cd NTSoftware/NTSoftware/ClientApp
```


Then type the following command to install the dependencies and start the application -

```bash
npm install
```
```bash
ng serve --open
```
The front-end server will start on port `4200`.


## default account admin:
```bash
lhngoc2497@gmail.com
```
and password:
```bash
Ngoc@12345
```

