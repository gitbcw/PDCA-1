import {
  Box,
  Heading,
  Table,
  Text,
  Badge,
  Flex,
  Spinner,
} from "@chakra-ui/react"
import { useColorModeValue } from "@/components/ui/color-mode"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { TasksService } from "@/client"
import AddTask from "@/components/Tasks/AddTask"
import TaskActionsMenu from "@/components/Tasks/TaskActionsMenu"
import { formatDate } from "@/utils"

export const Route = createFileRoute("/_layout/tasks")({
  component: TasksPage,
})

// 任务优先级对应的颜色
const priorityColors = {
  'low': "gray",
  'medium': "blue",
  'high': "orange",
  'urgent': "red",
}

// 任务状态对应的颜色
const statusColors = {
  'todo': "gray",
  'in_progress': "blue",
  'done': "green",
  'cancelled': "red",
}

// 任务状态对应的中文名称
const statusNames = {
  'todo': "待办",
  'in_progress': "进行中",
  'done': "已完成",
  'cancelled': "已取消",
}

// 任务优先级对应的中文名称
const priorityNames = {
  'low': "低",
  'medium': "中",
  'high': "高",
  'urgent': "紧急",
}

function TasksPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => TasksService.readTasks(),
  })

  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Spinner size="xl" />
      </Flex>
    )
  }

  if (error) {
    return (
      <Box p={4}>
        <Text color="red.500">加载任务失败: {error.message}</Text>
      </Box>
    )
  }

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">任务列表</Heading>
        <AddTask />
      </Flex>

      {data?.data.length === 0 ? (
        <Box
          p={8}
          textAlign="center"
          borderWidth={1}
          borderRadius="lg"
          borderColor={borderColor}
          bg={bgColor}
        >
          <Text fontSize="lg" color="gray.500">
            暂无任务，点击"新建任务"按钮创建第一个任务
          </Text>
        </Box>
      ) : (
        <Box
          borderWidth={1}
          borderRadius="lg"
          overflow="hidden"
          bg={bgColor}
          borderColor={borderColor}
        >
          <Table.Root variant="simple">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>标题</Table.ColumnHeader>
                <Table.ColumnHeader>优先级</Table.ColumnHeader>
                <Table.ColumnHeader>状态</Table.ColumnHeader>
                <Table.ColumnHeader>截止日期</Table.ColumnHeader>
                <Table.ColumnHeader>创建时间</Table.ColumnHeader>
                <Table.ColumnHeader width="80px">操作</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data.map((task) => (
                <Table.Row key={task.id} _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}>
                  <Table.Cell fontWeight="medium">{task.title}</Table.Cell>
                  <Table.Cell>
                    <Badge colorScheme={priorityColors[task.priority]}>
                      {priorityNames[task.priority]}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge colorScheme={statusColors[task.status]}>
                      {statusNames[task.status]}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{task.due_date ? formatDate(new Date(task.due_date)) : "无"}</Table.Cell>
                  <Table.Cell>{formatDate(new Date(task.created_at))}</Table.Cell>
                  <Table.Cell>
                    <TaskActionsMenu task={task} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  )
}

export default TasksPage
