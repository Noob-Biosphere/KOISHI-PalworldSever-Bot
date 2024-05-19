import { Context, segment } from 'koishi';

import { Config } from './config';

export const name = 'azimiao-palworld-server-tool';

export const inject = ['http'];

export * from "./config";


export function apply(ctx: Context, config: Config) {

    // TODO: 封装复用，减少重复代代码
    ctx.command("PalworldServerInfo", "获取帕鲁服务器信息").alias(config.serverInfoAlias).action(async (argv, _) => {

        let msg = "";

        await ctx.http.get(getFullUrl(config.baseUrl, "info"), {
            headers: {
                "Authorization": "Basic " + Buffer.from(`${config.adminName}:${config.adminPassword}`).toString("base64"),
            },
            responseType: "json"
        }).then((res) => {

            msg = (res.servername && res.version && res.description)
                ? `帕鲁服务器运行中\n - 名称: ${res.servername}\n - 版本: ${res.version}\n - 描述: ${res.description}`
                : "获取信息失败: 返回信息错误";

            argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${msg}` : msg);

        }).catch((error) => {
            msg = error.response
                ? `请求错误: ${error.response.data}`
                : `请求失败: ${(error.code ? `错误码 ${error.code})}` : "连接服务器失败，请检查服务器状态或后台配置信息")}`;

            argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${msg}` : msg);
        })

        return;
    });

    ctx.command("PalworldServerOnlinePlayers", "获取帕鲁服务器在线玩家").alias(config.serverOnlinePlayers).action(async (argv, _) => {
        let msg = "";
        await ctx.http.get(getFullUrl(config.baseUrl, "players"), {
            headers: {
                "Authorization": "Basic " + Buffer.from(`${config.adminName}:${config.adminPassword}`).toString("base64"),
            },
            responseType: "json"
        }).then((res) => {
            if (res.players) {

                if (res.players.length > 0) {

                    msg = `当前共 ${res.players.length} 位帕鲁在线：\n`;
                    res.players.forEach((player, index) => {
                        msg += `- [Lv.${player.level}] ${player.name} ${player.userId}\r\n`;
                    });

                } else {
                    msg = "没有帕鲁在线";
                }

            } else {
                msg = "获取信息失败: 返回信息错误";
            }

            argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${msg}` : msg);
            return;

        }).catch((error) => {
            let msg = error.response
                ? `请求错误: ${error.response.data}`
                : `请求失败: ${(error.code ? `错误码 ${error.code})}` : "连接服务器失败，请检查服务器状态或后台配置信息")}`;

            argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${msg}` : msg);
        })

        return;
    });

    ctx.command("PalworldServerAnnounce", "向帕鲁服务器发送公屏消息").alias(config.serverAnnounceMessage).action(async (argv, message) => {
        await ctx.http.post(
            getFullUrl(config.baseUrl, "announce"),
            JSON.stringify({
                "message": message
            }),
            {
                headers: {
                    "Authorization": "Basic " + Buffer.from(`${config.adminName}:${config.adminPassword}`).toString("base64"),
                    'Content-Type': 'application/json',
                },
            }).then((res) => {

                argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${"发送成功"},${res}` : `发送成功,${res}`);

            }).catch((error) => {
                let msg = error.response
                    ? `请求错误: ${error.response.data}`
                    : `请求失败: ${(error.code ? `错误码 ${error.code})}` : "连接服务器失败，请检查服务器状态或后台配置信息")}`;

                argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${msg}` : msg);
            })

        return;
    });

    ctx.command("PalworldServerSave", "向幻兽帕鲁服务器发送保存命令").alias(config.serverSave).action(async (argv, message) => {
        await ctx.http.post(
            getFullUrl(config.baseUrl, "save"),
            "",
            {
                headers: {
                    "Authorization": "Basic " + Buffer.from(`${config.adminName}:${config.adminPassword}`).toString("base64")
                },
            }).then((res) => {

                argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${"保存成功"},${res}` : `保存成功,${res}`);

            }).catch((error) => {
                let msg = error.response
                    ? `请求错误: ${error.response.data}`
                    : `请求失败: ${(error.code ? `错误码 ${error.code})}` : "连接服务器失败，请检查服务器状态或后台配置信息")}`;

                argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${msg}` : msg);
            })

        return;
    });


    ctx.command("PalworldServerKick", "幻兽帕鲁服务器踢出玩家").alias(config.serverKickPlayer).action(async (argv, userid,reason) => {
        if(!userid){
            argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${"未输入玩家的 UserID"}` : `未输入玩家的 UserID`);
            return;
        }
        await ctx.http.post(
            getFullUrl(config.baseUrl, "kick"),
            JSON.stringify({
                "userid" : userid,
                "message": reason ?? "Kick by admin"
            }),
            {
                headers: {
                    "Authorization": "Basic " + Buffer.from(`${config.adminName}:${config.adminPassword}`).toString("base64"),
                    'Content-Type': 'application/json',
                },
            }).then((res) => {

                argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${"踢出成功"},${res}` : `踢出成功,${res}`);

            }).catch((error) => {
                let msg = error.response
                    ? `请求错误: ${error.response.data},请检查后台配置或确认玩家是否在线？`
                    : `请求失败: ${(error.code ? `错误码 ${error.code})}` : "连接服务器失败，请检查服务器状态或后台配置信息")}`;

                argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${msg}` : msg);
            })

        return;
    });


    ctx.command("PalworldServerBan", "幻兽帕鲁服务器封禁玩家").alias(config.serverBanPlayer).action(async (argv, userid,reason) => {
        if(!userid){
            argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${"未输入玩家的 UserID"}` : `未输入玩家的 UserID`);
            return;
        }

        await ctx.http.post(
            getFullUrl(config.baseUrl, "ban"),
            JSON.stringify({
                "userid" : userid,
                "message": reason ?? "Admin Ban"
            }),
            {
                headers: {
                    "Authorization": "Basic " + Buffer.from(`${config.adminName}:${config.adminPassword}`).toString("base64"),
                    'Content-Type': 'application/json',
                },
            }).then((res) => {

                argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${"封禁成功"},${res}` : `封禁成功,${res}`);

            }).catch((error) => {
                let msg = error.response
                    ? `请求错误: ${error.response.data},请检查后台配置或确认玩家是否在线？`
                    : `请求失败: ${(error.code ? `错误码 ${error.code})}` : "连接服务器失败，请检查服务器状态或后台配置信息")}`;

                argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${msg}` : msg);
            })

        return;
    });


    ctx.command("PalworldServerUnban", "幻兽帕鲁服务器解封玩家").alias(config.serverUnBanPlayer).action(async (argv, userid) => {
        if(!userid){
            argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${"未输入玩家的 UserID"}` : `未输入玩家的 UserID`);
            return;
        }
        await ctx.http.post(
            getFullUrl(config.baseUrl, "unban"),
            JSON.stringify({
                "userid" : userid
            }),
            {
                headers: {
                    "Authorization": "Basic " + Buffer.from(`${config.adminName}:${config.adminPassword}`).toString("base64"),
                    'Content-Type': 'application/json',
                },
            }).then((res) => {

                argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${"解封成功"},${res}` : `解封成功,${res}`);

            }).catch((error) => {
                let msg = error.response
                    ? `请求错误: ${error.response.data},请检查后台配置或确认玩家是否在线？`
                    : `请求失败: ${(error.code ? `错误码 ${error.code})}` : "连接服务器失败，请检查服务器状态或后台配置信息")}`;

                argv.session?.send((argv.session && !argv.session.isDirect) ? `${segment.at(argv.session.userId)}\r\n${msg}` : msg);
            })

        return;
    });


    // write your plugin here
    // ctx.on("message", async (session) => {
    //     if (session.content === "serverInfo") {

    //     }
    // });
}



function getFullUrl(baseUrl: String, subInterface: String) {
    if (!baseUrl.endsWith('/')) {
        baseUrl = `${baseUrl}/`;
    }
    return `${baseUrl}${subInterface}`;
}
