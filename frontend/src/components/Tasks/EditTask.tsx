import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import {
  Button,
  Input,
  Textarea,
  Flex,
  VStack,
  Text,
} from "@chakra-ui/react"
import { FiEdit } from "react-icons/fi"

import { TaskPublic, TaskUpdate, TasksService } from "@/client"
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
import { Field } from "@/components/ui/field"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

interface EditTaskProps {
  task: TaskPublic
  trigger?: React.ReactNode
}

const EditTask = ({ task, trigger }: EditTaskProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()

  // 格式化日期为YYYY-MM-DD格式，用于日期输入框
  const formatDateForInput = (dateString: string | null | undefined) => {
    if (!dateString) return ""
    return new Date(dateString).toISOString().split("T")[0]
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<TaskUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "todo",
      due_date: formatDateForInput(task.due_date),
    },
  })

  const mutation = useMutation({
    mutationFn: (data: TaskUpdate) =>
      TasksService.updateTask({
        taskId: task.id,
        requestBody: data
      }),
    onSuccess: () => {
      showSuccessToast("任务更新成功")
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  const onSubmit = (data: TaskUpdate) => {
    mutation.mutate(data)
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="ghost">
            <FiEdit fontSize="16px" />
            编辑
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑任务</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <Text mb={4}>修改任务信息</Text>
            <VStack gap={4}>
              <Field
                required
                invalid={!!errors.title}
                errorText={errors.title?.message}
                label="标题"
              >
                <Input
                  id="title"
                  {...register("title", {
                    required: "标题不能为空",
                    minLength: {
                      value: 1,
                      message: "标题至少需要1个字符",
                    },
                    maxLength: {
                      value: 255,
                      message: "标题不能超过255个字符",
                    },
                  })}
                  placeholder="输入任务标题"
                  type="text"
                />
              </Field>

              <Field
                label="描述"
              >
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="输入任务描述（可选）"
                />
              </Field>

              <Field
                label="优先级"
              >
                <select {...register("priority")}>
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                  <option value="urgent">紧急</option>
                </select>
              </Field>

              <Field
                label="状态"
              >
                <select {...register("status")}>
                  <option value="todo">待办</option>
                  <option value="in_progress">进行中</option>
                  <option value="done">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </Field>

              <Field
                label="截止日期"
              >
                <Input
                  id="due_date"
                  {...register("due_date")}
                  type="date"
                />
              </Field>
            </VStack>
          </DialogBody>
          <DialogFooter>
            <Flex gap={2} justify="flex-end">
              <DialogCloseTrigger asChild>
                <Button variant="outline">取消</Button>
              </DialogCloseTrigger>
              <DialogActionTrigger asChild>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isValid}
                >
                  更新
                </Button>
              </DialogActionTrigger>
            </Flex>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default EditTask
