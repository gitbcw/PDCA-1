import {
  Box,
  Button,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Badge,
  Flex,
  Spinner,
} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { FiPlus } from "react-icons/fi"

import { TaskService, TaskPriority, TaskStatus } from "@/client"
import Navbar from "@/components/Common/Navbar"
import Sidebar from "@/components/Common/Sidebar"
import { isLoggedIn } from "@/hooks/useAuth"
import { formatDate } from "@/utils"

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      })
    }
  },
})

// 任务优先级对应的颜色
const priorityColors = {
  [TaskPriority.LOW]: "gray",
  [TaskPriority.MEDIUM]: "blue",
  [TaskPriority.HIGH]: "orange",
  [TaskPriority.URGENT]: "red",
}

// 任务状态对应的颜色
const statusColors = {
  [TaskStatus.TODO]: "gray",
  [TaskStatus.IN_PROGRESS]: "blue",
  [TaskStatus.DONE]: "green",
  [TaskStatus.CANCELLED]: "red",
}

// 任务状态对应的中文名称
const statusNames = {
  [TaskStatus.TODO]: "待办",
  [TaskStatus.IN_PROGRESS]: "进行中",
  [TaskStatus.DONE]: "已完成",
  [TaskStatus.CANCELLED]: "已取消",
}

// 任务优先级对应的中文名称
const priorityNames = {
  [TaskPriority.LOW]: "低",
  [TaskPriority.MEDIUM]: "中",
  [TaskPriority.HIGH]: "高",
  [TaskPriority.URGENT]: "紧急",
}

function TasksPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => TaskService.readTasks(),
  })

  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  const content = (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">任务列表</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue">
          新建任务
        </Button>
      </Flex>

      {isLoading ? (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" />
        </Flex>
      ) : error ? (
        <Box p={4}>
          <Text color="red.500">加载任务失败: {error.message}</Text>
        </Box>
      ) : data?.data.length === 0 ? (
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
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>标题</Th>
                <Th>优先级</Th>
                <Th>状态</Th>
                <Th>截止日期</Th>
                <Th>创建时间</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.data.map((task) => (
                <Tr key={task.id} _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}>
                  <Td fontWeight="medium">{task.title}</Td>
                  <Td>
                    <Badge colorScheme={priorityColors[task.priority]}>
                      {priorityNames[task.priority]}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={statusColors[task.status]}>
                      {statusNames[task.status]}
                    </Badge>
                  </Td>
                  <Td>{task.due_date ? formatDate(new Date(task.due_date)) : "无"}</Td>
                  <Td>{formatDate(new Date(task.created_at))}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  )

  return (
    <Flex direction="column" h="100vh">
      <Navbar />
      <Flex flex="1" overflow="hidden">
        <Sidebar />
        <Flex flex="1" direction="column" p={4} overflowY="auto">
          {content}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default TasksPage
