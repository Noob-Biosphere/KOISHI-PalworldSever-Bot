# koishi-plugin-azimiao-palworld-server-tool

azimiao's palworld server tool

梓喵出没的 Koishi 帕鲁服务器管理机器人

## 重要

<b>请通过 Koishi 的平台能力设置鉴权，管理员信息等，否则任何人都可调用封禁等方法，设置的步骤为：</b>

1. 进入`插件配置/azimiao-palworld-server-tool`
2. 设置过滤器，例如`用户ID 等于 管理员QQ号`

## 说明

### 原理

基于 Palworld Server 当前的 REST API 编写的简易机器人脚本。

### 命令

#### /PalworldServerInfo 

获取服务器描述信息

#### /PalworldServerOnlinePlayers

获取当前在线玩家

#### /PalworldServerAnnounce

发送公屏公告消息
#### /PalworldServerSave

向幻兽帕鲁服务器发送保存命令

#### /PalworldServerKick/PalworldServerBan/PalworldServerUnban

踢出/封禁/解封玩家

## 安全性说明

对脚本涉及的某些安全性信息做出说明。

### 数据存储

使用 Koishi 提供的 Schema 进行数据存储，安全性请参阅 Koishi 官方文档。

### 注意：防范中间人获取密码

Palworld Server API 身份验证采用 Basic Auth，即每条请求中都包含 base64 编码的账号与密码。

base64 是一个可逆编码，可直接解码出管理员账号与密码。

Palworld 创建的 HTTP 服务器未使用 HTTPS 加密，数据为明文传输。

<b>使用 HTTPS 加密可有效防止中间人获取数据</b>，对于部署在公网且使用公网访问 API 的 Palworld 服务器，推荐使用 HTTPS 反代 Palworld Server 的 REST API，以避免被中间人截获 Basic Auth 信息。

### UserID/SteamID

获取玩家列表时会将 UserID(一般为 SteamID) 一并输出，此 ID 用于用户封禁、踢出等命令。

和昵称等信息一样，SteamID 为公开信息，无需担心信息泄露。

注：通过[SteamIDFinder](https://www.steamidfinder.com)等三方网站即可获取任意用户的 SteamID。

### 访问阈值

推荐使用 Koishi 平台能力，对每条命令设置合理的访问频率阈值或每日阈值(`koishi/指令管理`)。

