-- CreateEnum
CREATE TYPE "CallTypeEnum" AS ENUM ('voice', 'video');

-- CreateEnum
CREATE TYPE "ChatTypeEnum" AS ENUM ('group', 'chat');

-- CreateEnum
CREATE TYPE "ChatVisibilityEnum" AS ENUM ('public', 'private');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'none');

-- CreateEnum
CREATE TYPE "JoinTypeEnum" AS ENUM ('anyone', 'selected');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video', 'audio');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('text', 'media', 'audio', 'file', 'voicenote', 'textcaption', 'voicenotecaption', 'mediacaption');

-- CreateEnum
CREATE TYPE "RequestTypeEnum" AS ENUM ('sent', 'received');

-- CreateTable
CREATE TABLE "Chats" (
    "id" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "description" TEXT,
    "type" "ChatTypeEnum" NOT NULL DEFAULT 'chat',
    "visibility" "ChatVisibilityEnum",

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatsUser" (
    "id" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "chatsId" TEXT,
    "uid" TEXT NOT NULL,

    CONSTRAINT "ChatsUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friends" (
    "id" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "usersId" TEXT,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendsRequest" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "type" "RequestTypeEnum" NOT NULL,
    "usersId" TEXT,

    CONSTRAINT "FriendsRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Groups" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "usersId" TEXT,

    CONSTRAINT "Groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "messagesId" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meetings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "meetingDate" TIMESTAMP(3) NOT NULL,
    "joinType" "JoinTypeEnum" NOT NULL,
    "callType" "CallTypeEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingsParticipants" (
    "meetingId" TEXT,
    "uid" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "id" TEXT NOT NULL,

    CONSTRAINT "MeetingsParticipants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "messageId" TEXT,
    "userIds" TEXT[],

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "captionRef" TEXT,
    "message" TEXT,
    "gifs" TEXT,
    "sticker" TEXT,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chatId" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "displayName" TEXT NOT NULL,
    "photoURL" TEXT,
    "coverURL" TEXT,
    "bio" TEXT,
    "gender" "Gender",
    "birthday" DATE,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chats_id_key" ON "Chats"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatsUser_id_key" ON "ChatsUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Friends_id_key" ON "Friends"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FriendsRequest_id_key" ON "FriendsRequest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Groups_id_key" ON "Groups"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Media_id_key" ON "Media"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Meetings_id_key" ON "Meetings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingsParticipants_id_key" ON "MeetingsParticipants"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_id_key" ON "Reaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "messages_id_key" ON "messages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_displayName_key" ON "users"("displayName");

-- AddForeignKey
ALTER TABLE "ChatsUser" ADD CONSTRAINT "ChatsUser_chatsId_fkey" FOREIGN KEY ("chatsId") REFERENCES "Chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendsRequest" ADD CONSTRAINT "FriendsRequest_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_messagesId_fkey" FOREIGN KEY ("messagesId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingsParticipants" ADD CONSTRAINT "MeetingsParticipants_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
