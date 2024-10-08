"use client"

import { useEffect, useState } from "react";
import CreateServerModal from "@/components/modals/CreateServerModal";
import InviteModal from "@/components/modals/InviteModal";
import EditServerModal from "@/components/modals/EditServerModal";
import MembersModal from "@/components/modals/MembersModal";
import CreateChannelModal from "@/components/modals/CreateChannelModal";
import LeaveServerModal from "@/components/modals/LeaveServerModal";
import DeleteServerModal from "../modals/DeleteServerModal";
import DeleteChannelModal from "../modals/DeleteChannelModal";
import EditeChannelModal from "../modals/EditeChannelModal";
import MessageFileModal from "../modals/MessageFileModal";
import DeleteMessageModal from "../modals/DeleteMessageModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, [])
  if (!isMounted) return null;
  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditeChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  )
}

export default ModalProvider
