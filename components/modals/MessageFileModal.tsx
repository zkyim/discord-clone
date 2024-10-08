"use client";
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUpload from "../FileUpload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import qs from "query-string"
import { useState } from "react";

const formSchema = z.object({
		fileUrl: z.string().min(1, {
				message: "Server image URL is required"
		})
})

const MessageFileModal = () => {
	const [fileType, setFileType] = useState("");
	const { isOpen, onClose, type, data } = useModal();
	const router = useRouter();
	const { apiUrl, query } = data;

	const isModalOpen = isOpen && type === "messageFile";

	const form = useForm({
			resolver: zodResolver(formSchema),
			defaultValues: {
				fileUrl: "",
			}
	})

	const handleClose = () => {
		form.reset();
		onClose();
	}

	const isLoading = form.formState.isSubmitting;

	const changeType = (fileUploadType: string) => {
		setFileType(fileUploadType);
	}

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl || "",
				query,
			});

		  await axios.post(url, {...values, fileType, content: values.fileUrl})

			form.reset();
			router.refresh();
			handleClose();
		}catch (e) {
			console.log(e)
		}
	}
	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent
				className='bg-white text-black p-0 overflow-hidden'
			>
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center font-bold'>
						Add an attachmet
					</DialogTitle>
					<DialogDescription className='text-center text-zinc-500'>
						Send afile as a massage.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField 
									control={form.control}
									name="fileUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload
													endpoint="messageFile"
													value={field.value}
													changeType={changeType}
													onChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
						  <Button 
								disabled={isLoading}
								variant={'primaty'}
							>
							  Send
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default MessageFileModal