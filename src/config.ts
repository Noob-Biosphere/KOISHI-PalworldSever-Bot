import { Schema } from 'koishi';

export interface AzimiaoPalworldConnectConfig {
    baseUrl: string,
    adminName: string,
    adminPassword: string,
}

export interface AzimiaoPalworldCommandConfig {
    serverInfoAlias: string,
    serverOnlinePlayers: string,
    serverAnnounceMessage: string,
    serverSave: string,
    serverKickPlayer: string,
    serverBanPlayer: string,
    serverUnBanPlayer : string,
}

export type Config = AzimiaoPalworldConnectConfig & AzimiaoPalworldCommandConfig;

// koishi 配置信息
export const Config: Schema<Config> = Schema.intersect([
    Schema.object({
        baseUrl: Schema.string().description("幻兽帕鲁服务器 REST API 地址<br>建议公网服务器使用HTTPS确保账号密码安全").required(),
        adminName: Schema.string().description("管理员名称").default("admin"),
        adminPassword: Schema.string().description("管理员密码").required(),
    }).description("连接设置"),
    Schema.object({
        serverInfoAlias: Schema.string().description("获取幻兽帕鲁服务器信息<br>PalworldServerInfo").default("帕鲁服信息"),
        serverOnlinePlayers: Schema.string().description("获取幻兽帕鲁服务器在线玩家<br>PalworldServerOnlinePlayers").default("帕鲁服在线玩家"),
        serverAnnounceMessage: Schema.string().description("向幻兽帕鲁服务器发送公屏公告消息<br>PalworldServerAnnounce").default("帕鲁服公告消息"),
        serverSave:Schema.string().description("向幻兽帕鲁服务器发送保存命令<br>PalworldServerAnnounce").default("帕鲁服保存"),
        serverKickPlayer: Schema.string().description("幻兽帕鲁服务器踢出玩家<br>PalworldServerKick").default("帕鲁服踢出"),
        serverBanPlayer: Schema.string().description("幻兽帕鲁服务器封禁玩家<br>PalworldServerBan").default("帕鲁服封禁"),
        serverUnBanPlayer: Schema.string().description("幻兽帕鲁服务器解封玩家<br>PalworldServerUnban").default("帕鲁服解封"),
    }).description("命令别名")
]);
