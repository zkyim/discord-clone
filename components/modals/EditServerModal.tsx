"use client";
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "../FileUpload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";

const formSchema = z.object({
		name: z.string().min(1, {
				message: "Server name is required"
		}),
		imageUrl: z.string().min(1, {
				message: "Server image URL is required"
		})
})

const EditServerModal = () => {
	const { isOpen, onClose, type, data } = useModal();
	const router = useRouter();

	const isModalOpen = isOpen && type === "editServer";
	const { server } = data;


	const form = useForm({
			resolver: zodResolver(formSchema),
			defaultValues: {
				name: "",
				imageUrl: "",
			}
	});

	const [serverId, setServerId] = useState("");
	useEffect(() => {
		if (server) {
			form.setValue("name", server.name);
			form.setValue("imageUrl", server.imageUrl);
			setServerId(server.id);
		}
	}, [form, server])

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
		  await axios.patch(`/api/servers/${serverId}`, values)

			form.reset();
			router.refresh();
			onClose();
		}catch (e) {
			console.log(e)
		}
	}

	const handleClose = () => {
		form.reset();
		onClose();
	}
	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent
				className='bg-white text-black p-0 overflow-hidden'
				>
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center font-bold'>
						Customize your server 
					</DialogTitle>
					<DialogDescription className='text-center text-zinc-500'>
						Give your server a peronality with a name and an image. You can always change it later.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="space-y-8 px-6">
							<div className="flex items-center justify-center text-center">
								<FormField 
									control={form.control}
									name="imageUrl"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<FileUpload 
													endpoint="serverImage"
													value={field.value}
													onChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField 
							  control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input 
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Enter server name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="bg-gray-100 px-6 py-4">
						  <Button 
								disabled={isLoading}
								variant={'primaty'}
							>
							  Save
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default EditServerModal