import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button, Text } from "@chakra-ui/react"
import { FiTrash2 } from "react-icons/fi"

import { TaskPublic, TasksService } from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

interface DeleteTaskProps {
  task: TaskPublic
  trigger?: React.ReactNode
}

const DeleteTask = ({ task, trigger }: DeleteTaskProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()

  const mutation = useMutation({
    mutationFn: () => TasksService.deleteTask({ taskId: task.id }),
    onSuccess: () => {
      showSuccessToast("任务删除成功")
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  const handleDelete = () => {
    mutation.mutate()
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            leftIcon={<FiTrash2 />}
            size="sm"
            variant="ghost"
            colorScheme="red"
          >
            删除
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>删除任务</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text>
            确定要删除任务 <strong>{task.title}</strong> 吗？此操作无法撤销。
          </Text>
        </DialogBody>
        <DialogFooter>
          <DialogCloseTrigger asChild>
            <Button variant="outline">取消</Button>
          </DialogCloseTrigger>
          <DialogActionTrigger asChild>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              isLoading={mutation.isPending}
            >
              删除
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}

export default DeleteTask
