import { Client, GatewayIntentBits, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType, REST, Routes } from 'discord.js';
import { storage } from './storage';

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN || process.env.DISCORD_TOKEN || '';
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const GUILD_ID = process.env.DISCORD_GUILD_ID || '';
const APPLICATION_CHANNEL_ID = process.env.DISCORD_APPLICATION_CHANNEL_ID || '';
const LOG_CHANNEL_ID = process.env.DISCORD_LOG_CHANNEL_ID || '';
const ADMIN_ROLE_ID = process.env.DISCORD_ADMIN_ROLE_ID || '';
const WHITELIST_CHANNEL_ID = APPLICATION_CHANNEL_ID; // Backward compatibility
const ADMIN_CHANNEL_ID = LOG_CHANNEL_ID; // Backward compatibility

let client: Client;

// Enhanced logging function for Discord channels
export async function logToChannel(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  if (!client || !LOG_CHANNEL_ID) return;
  
  try {
    const channel = await client.channels.fetch(LOG_CHANNEL_ID);
    if (!channel || channel.type !== ChannelType.GuildText) return;
    
    const colors = {
      info: '#3498db',
      success: '#2ecc71',
      warning: '#f39c12',
      error: '#e74c3c'
    };
    
    const emojis = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    
    const embed = new EmbedBuilder()
      .setColor(colors[type] as any)
      .setDescription(`${emojis[type]} ${message}`)
      .setTimestamp();
    
    await channel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Error logging to Discord channel:', error);
  }
}

// Get Discord user info
export async function getDiscordUserInfo(userId: string) {
  if (!client || !GUILD_ID) return null;
  
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const member = await guild.members.fetch(userId);
    
    return {
      id: member.user.id,
      username: member.user.username,
      displayName: member.displayName,
      avatar: member.user.displayAvatarURL(),
      joinedAt: member.joinedAt,
      roles: member.roles.cache.map(role => role.name).filter(name => name !== '@everyone'),
      isAdmin: member.roles.cache.has(ADMIN_ROLE_ID)
    };
  } catch (error) {
    console.error('Error fetching Discord user info:', error);
    return null;
  }
}

export async function startDiscordBot() {
  if (!DISCORD_TOKEN) {
    console.warn('Discord bot token not provided. Bot functionality will be disabled.');
    return;
  }

  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
    ],
  });

  client.once('clientReady', async () => {
    console.log(`Discord bot logged in as ${client.user?.tag}`);
    
    // Register slash commands
    await registerSlashCommands();
    
    // Log bot startup
    await logToChannel('🤖 Discord bot started and ready for applications!', 'info');
  });

  // Handle slash commands
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'whitelist') {
        await handleWhitelistCommand(interaction);
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === 'whitelist_application') {
        await handleApplicationSubmit(interaction);
      }
    } else if (interaction.isButton()) {
      if (interaction.customId.startsWith('approve_') || interaction.customId.startsWith('reject_')) {
        await handleAdminAction(interaction);
      } else if (interaction.customId.startsWith('details_')) {
        await handleDetailsView(interaction);
      }
    }
  });

  await client.login(DISCORD_TOKEN);
}

async function registerSlashCommands() {
  if (!CLIENT_ID) {
    console.warn('DISCORD_CLIENT_ID not provided. Slash commands will not be registered.');
    return;
  }

  const commands = [
    new SlashCommandBuilder()
      .setName('whitelist')
      .setDescription('Start a whitelist application for Prime City RP')
  ];

  const rest = new REST().setToken(DISCORD_TOKEN);

  try {
    console.log(`Attempting to register slash commands for application ID: ${CLIENT_ID}`);
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands.map(command => command.toJSON()),
    });
    console.log('✅ Successfully registered Discord slash commands.');
  } catch (error) {
    console.error('❌ Error registering Discord slash commands:', error);
    console.log('💡 Make sure DISCORD_CLIENT_ID matches your bot\'s Application ID from Discord Developer Portal');
  }
}

async function handleWhitelistCommand(interaction: any) {
  // Check if command is used in correct channel
  if (WHITELIST_CHANNEL_ID && interaction.channelId !== WHITELIST_CHANNEL_ID) {
    return interaction.reply({
      content: `❌ This command can only be used in the designated whitelist channel.`,
      ephemeral: true,
    });
  }

  // Create application modal
  const modal = new ModalBuilder()
    .setCustomId('whitelist_application')
    .setTitle('Prime City Whitelist Application');

  // Create text inputs
  const aboutInput = new TextInputBuilder()
    .setCustomId('about_yourself')
    .setLabel('Tell us about yourself (50 words minimum)')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(1000);

  const rpExperienceInput = new TextInputBuilder()
    .setCustomId('rp_experience')
    .setLabel('RP Experience & Motivation (50 words minimum)')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(1000);

  const discordIdInput = new TextInputBuilder()
    .setCustomId('discord_id')
    .setLabel('Discord ID (Example: 781463891985669475)')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const steamIdInput = new TextInputBuilder()
    .setCustomId('steam_id')
    .setLabel('Steam Hex ID (Example: 110000146218998)')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const characterNameInput = new TextInputBuilder()
    .setCustomId('character_name')
    .setLabel('Character Full Name')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  // Add inputs to action rows
  const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(aboutInput);
  const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(rpExperienceInput);
  const thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(discordIdInput);
  const fourthActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(steamIdInput);
  const fifthActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(characterNameInput);

  modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

  await interaction.showModal(modal);
}

async function handleApplicationSubmit(interaction: any) {
  // Since Discord modals are limited to 5 text inputs, we'll collect basic info first
  // and then ask for additional details in a follow-up
  
  const aboutYourself = interaction.fields.getTextInputValue('about_yourself');
  const rpExperience = interaction.fields.getTextInputValue('rp_experience');
  const discordId = interaction.fields.getTextInputValue('discord_id');
  const steamId = interaction.fields.getTextInputValue('steam_id');
  const characterName = interaction.fields.getTextInputValue('character_name');

  // For demo purposes, we'll create a basic application with placeholder data for missing fields
  const applicationData = {
    userId: interaction.user.id,
    username: `${interaction.user.username}#${interaction.user.discriminator}`,
    discordId,
    steamId,
    aboutYourself,
    rpExperience,
    characterName,
    characterAge: '25', // Would normally collect this in a follow-up
    characterNationality: 'American', // Would normally collect this in a follow-up
    characterBackstory: 'Detailed backstory to be provided in follow-up.', // Would normally collect this
    contentCreation: '',
    previousServers: '',
    rulesRead: true,
    cfxLinked: true,
  };

  try {
    const application = await storage.createApplication(applicationData);
    
    // Send confirmation to user
    await interaction.reply({
      content: `✅ **Application Submitted Successfully!**\n\nThank you ${interaction.user}! Your whitelist application has been submitted and is now under review.\n\n**Application ID:** \`${application.id}\`\n**Submitted:** ${new Date().toLocaleString()}`,
      ephemeral: true,
    });

    // Enhanced notifications with HTML-style formatting
    await sendAdminNotification(application);
    await sendApplicationLog(application);
    await logToChannel(`New application submitted by ${application.username} (ID: ${application.id})`, 'info');
    
    // Send HTML-formatted email-style notification to user
    await sendUserConfirmation(application, interaction.user);

  } catch (error) {
    console.error('Error creating application:', error);
    await interaction.reply({
      content: '❌ There was an error submitting your application. Please try again.',
      ephemeral: true,
    });
  }
}

async function sendAdminNotification(application: any) {
  if (!ADMIN_CHANNEL_ID) return;

  const adminChannel = await client.channels.fetch(ADMIN_CHANNEL_ID);
  if (!adminChannel || adminChannel.type !== ChannelType.GuildText) return;

  const embed = new EmbedBuilder()
    .setColor('#FFFF00')
    .setTitle('🔔 New Whitelist Application')
    .addFields(
      { name: 'Applicant', value: application.username, inline: true },
      { name: 'Application ID', value: `\`${application.id}\``, inline: true },
      { name: 'Character Name', value: application.characterName, inline: true },
      { name: 'Discord ID', value: `\`${application.discordId}\``, inline: true },
      { name: 'Steam ID', value: `\`${application.steamId}\``, inline: true },
      { name: '\u200B', value: '\u200B', inline: true },
      { name: 'About', value: application.aboutYourself.substring(0, 1024), inline: false },
      { name: 'RP Experience', value: application.rpExperience.substring(0, 1024), inline: false },
    )
    .setTimestamp();

  const approveButton = new ButtonBuilder()
    .setCustomId(`approve_${application.id}`)
    .setLabel('✅ Approve')
    .setStyle(ButtonStyle.Success);

  const rejectButton = new ButtonBuilder()
    .setCustomId(`reject_${application.id}`)
    .setLabel('❌ Reject')
    .setStyle(ButtonStyle.Danger);

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(approveButton, rejectButton);

  await adminChannel.send({
    content: ADMIN_ROLE_ID ? `<@&${ADMIN_ROLE_ID}>` : undefined,
    embeds: [embed],
    components: [actionRow],
  });
}

async function sendApplicationLog(application: any) {
  if (!WHITELIST_CHANNEL_ID) return;

  const channel = await client.channels.fetch(WHITELIST_CHANNEL_ID);
  if (!channel || channel.type !== ChannelType.GuildText) return;

  const embed = new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('📝 Application Submitted')
    .setDescription(`**${application.username}** has submitted a whitelist application.`)
    .addFields(
      { name: 'Character', value: application.characterName, inline: true },
      { name: 'Application ID', value: `\`${application.id}\``, inline: true },
      { name: 'Status', value: '⏳ Pending Review', inline: true },
    )
    .setTimestamp();

  await channel.send({ embeds: [embed] });
}

async function handleAdminAction(interaction: any) {
  const [action, applicationId] = interaction.customId.split('_');
  
  try {
    const application = await storage.getApplication(applicationId);
    if (!application) {
      return interaction.reply({
        content: '❌ Application not found.',
        ephemeral: true,
      });
    }

    if (application.status !== 'pending') {
      return interaction.reply({
        content: '❌ This application has already been reviewed.',
        ephemeral: true,
      });
    }

    const reviewData = {
      status: action as 'approved' | 'rejected',
      reviewedBy: `${interaction.user.username}#${interaction.user.discriminator}`,
      reviewReason: action === 'rejected' ? 'Reviewed by admin' : undefined,
    };

    const updatedApplication = await storage.updateApplication(applicationId, reviewData);
    
    if (action === 'approved') {
      await sendApprovalMessage(updatedApplication!, interaction.user);
    } else {
      await sendRejectionMessage(updatedApplication!, interaction.user);
    }

    await interaction.reply({
      content: `✅ Application ${action} successfully.`,
      ephemeral: true,
    });

    // Update the original message to show it's been reviewed
    await interaction.message.edit({
      components: [], // Remove buttons
      embeds: [
        ...interaction.message.embeds,
        new EmbedBuilder()
          .setColor(action === 'approved' ? '#00FF00' : '#FF0000')
          .setDescription(`**${action.toUpperCase()}** by ${interaction.user} at ${new Date().toLocaleString()}`)
      ]
    });

  } catch (error) {
    console.error('Error handling admin action:', error);
    await interaction.reply({
      content: '❌ There was an error processing this action.',
      ephemeral: true,
    });
  }
}

async function sendApprovalMessage(application: any, admin: any) {
  if (!WHITELIST_CHANNEL_ID) return;

  const channel = await client.channels.fetch(WHITELIST_CHANNEL_ID);
  if (!channel || channel.type !== ChannelType.GuildText) return;

  const embed = new EmbedBuilder()
    .setColor('#ADFF2F')
    .setTitle('🎉 WELCOME TO LOS SANTOS!')
    .setDescription('**YOUR VISA HAS BEEN GRANTED**')
    .addFields(
      { name: 'Accepted By', value: admin.username, inline: false },
      { name: 'Applicant', value: `<@${application.userId}>`, inline: true },
      { name: 'Character', value: application.characterName, inline: true },
      { name: 'Approved by', value: `<@${admin.id}>`, inline: true },
      { name: 'Approval Date', value: new Date().toLocaleString(), inline: false },
    )
    .setTimestamp();

  await channel.send({
    content: `🎭 **Congratulations <@${application.userId}>!** Your whitelist application has been **APPROVED**!`,
    embeds: [embed],
  });

  // Send log to admin channel
  if (ADMIN_CHANNEL_ID) {
    const adminChannel = await client.channels.fetch(ADMIN_CHANNEL_ID);
    if (adminChannel && adminChannel.type === ChannelType.GuildText) {
      await adminChannel.send(`✅ **${application.username}** approved by **${admin.username}** at ${new Date().toLocaleString()}`);
    }
  }
}

async function sendRejectionMessage(application: any, admin: any) {
  if (!WHITELIST_CHANNEL_ID) return;

  const channel = await client.channels.fetch(WHITELIST_CHANNEL_ID);
  if (!channel || channel.type !== ChannelType.GuildText) return;

  const embed = new EmbedBuilder()
    .setColor('#FF4444')
    .setTitle('❌ SORRY BUT WE DIDN\'T MAKE IT')
    .setDescription('**YOUR VISA HAS BEEN REJECTED**')
    .addFields(
      { name: 'Rejected By', value: admin.username, inline: false },
      { name: 'Applicant', value: `<@${application.userId}>`, inline: true },
      { name: 'Reason', value: application.reviewReason || 'Application did not meet requirements', inline: true },
      { name: 'Rejected by', value: `<@${admin.id}>`, inline: true },
      { name: 'Rejection Date', value: new Date().toLocaleString(), inline: true },
      { name: 'Reapplication Available', value: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString(), inline: true },
    )
    .setTimestamp();

  await channel.send({
    content: `<@${application.userId}> Your whitelist application has been **REJECTED**.`,
    embeds: [embed],
  });

  // Send log to admin channel
  if (ADMIN_CHANNEL_ID) {
    const adminChannel = await client.channels.fetch(ADMIN_CHANNEL_ID);
    if (adminChannel && adminChannel.type === ChannelType.GuildText) {
      await adminChannel.send(`❌ **${application.username}** rejected by **${admin.username}** at ${new Date().toLocaleString()}`);
    }
  }
}

// Send HTML-formatted confirmation to user
async function sendUserConfirmation(application: any, user: any) {
  try {
    // Send DM to user with HTML-style formatted message
    const confirmationEmbed = new EmbedBuilder()
      .setColor('#00d4aa')
      .setTitle('🎭 Application Submitted Successfully!')
      .setDescription(`
        **Thank you for applying to Prime City RP!**
        
        Your whitelist application has been received and is now under review by our admin team.
        
        **Application Details:**
        • **Application ID:** \`${application.id}\`
        • **Character Name:** ${application.characterName}
        • **Submitted:** ${new Date().toLocaleString()}
        • **Status:** 🔄 Pending Review
        
        **What happens next?**
        • Our admin team will review your application
        • You'll receive a notification once reviewed
        • Please be patient - reviews may take 24-48 hours
        
        **Need help?** Contact our support team in <#${APPLICATION_CHANNEL_ID}>
      `)
      .setThumbnail(user.displayAvatarURL())
      .setFooter({ text: 'Prime City RP - Whitelist System' })
      .setTimestamp();
    
    await user.send({ embeds: [confirmationEmbed] });
  } catch (error) {
    console.log('Could not send DM to user, they may have DMs disabled');
  }
}

// Handle details view button
async function handleDetailsView(interaction: any) {
  const applicationId = interaction.customId.split('_')[1];
  
  try {
    const application = await storage.getApplication(applicationId);
    if (!application) {
      return interaction.reply({
        content: '❌ Application not found.',
        ephemeral: true,
      });
    }

    const detailEmbed = new EmbedBuilder()
      .setColor('#6366f1')
      .setTitle(`📋 Full Application Details - ${application.characterName}`)
      .setDescription(`**Complete application information for ${application.username}**`)
      .addFields(
        { name: '👤 Applicant Info', value: `**Discord:** <@${application.userId}>\n**Username:** ${application.username}\n**Discord ID:** \`${application.discordId}\`\n**Steam ID:** \`${application.steamId}\``, inline: false },
        { name: '🎭 Character Details', value: `**Name:** ${application.characterName}\n**Age:** ${application.characterAge}\n**Nationality:** ${application.characterNationality}`, inline: true },
        { name: '📅 Application Info', value: `**ID:** \`${application.id}\`\n**Status:** ${application.status}\n**Submitted:** ${new Date(application.createdAt).toLocaleString()}`, inline: true },
        { name: '📝 About Themselves', value: application.aboutYourself.length > 1024 ? application.aboutYourself.substring(0, 1021) + '...' : application.aboutYourself, inline: false },
        { name: '🎮 RP Experience', value: application.rpExperience.length > 1024 ? application.rpExperience.substring(0, 1021) + '...' : application.rpExperience, inline: false },
        { name: '📖 Character Backstory', value: application.characterBackstory.length > 1024 ? application.characterBackstory.substring(0, 1021) + '...' : application.characterBackstory, inline: false }
      )
      .setTimestamp();

    if (application.contentCreation) {
      detailEmbed.addFields({ name: '🎬 Content Creation', value: application.contentCreation, inline: false });
    }
    
    if (application.previousServers) {
      detailEmbed.addFields({ name: '🖥️ Previous Servers', value: application.previousServers, inline: false });
    }

    await interaction.reply({
      embeds: [detailEmbed],
      ephemeral: true,
    });

  } catch (error) {
    console.error('Error viewing application details:', error);
    await interaction.reply({
      content: '❌ There was an error retrieving application details.',
      ephemeral: true,
    });
  }
}
