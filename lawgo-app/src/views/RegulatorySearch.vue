<script setup lang="ts">
import IconButton from '@/components/IconButton.vue';
import { ArrowLeft, Clock, TrendingUp, BookOpen, Scale, Building, Users, Shield } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { toast } from 'vue-sonner';

const searchQuery = ref('');
const searchHistory = ref<string[]>([]);

// 热门搜索
const hotSearches = ref([
  '劳动合同法', '民法典', '婚姻法', '继承法', '侵权责任法',
  '合同法', '物权法', '刑法', '行政诉讼法', '消费者权益保护法'
]);

// 法规分类
const lawCategories = ref([
  { name: '民事法律', icon: Users, color: '#409eff', desc: '民法典、合同法等' },
  { name: '刑事法律', icon: Shield, color: '#f56c6c', desc: '刑法、刑诉法等' },
  { name: '商事法律', icon: Building, color: '#67c23a', desc: '公司法、证券法等' },
  { name: '行政法律', icon: Scale, color: '#e6a23c', desc: '行政法、行政诉讼法等' },
  { name: '劳动法律', icon: BookOpen, color: '#909399', desc: '劳动法、劳动合同法等' },
  { name: '其他法律', icon: BookOpen, color: '#606266', desc: '环境法、税法等' }
]);

// 搜索建议
const searchTips = ref([
  '可以搜索具体法条，如"民法典第188条"',
  '支持模糊搜索，如"合同违约责任"',
  '可以搜索法律条文关键词',
  '支持搜索司法解释和规章制度'
]);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 添加到搜索历史
    const query = searchQuery.value.trim();
    if (!searchHistory.value.includes(query)) {
      searchHistory.value.unshift(query);
      if (searchHistory.value.length > 10) {
        searchHistory.value = searchHistory.value.slice(0, 10);
      }
      localStorage.setItem('lawSearchHistory', JSON.stringify(searchHistory.value));
    }

    window.open(`https://bing.com/search?q=${searchQuery.value}`)
  } else {
    toast.info('请输入检索内容')
  }
};

const handleHotSearch = (keyword: string) => {
  searchQuery.value = keyword;
  handleSearch();
};

const handleCategorySearch = (category: string) => {
  searchQuery.value = category;
  handleSearch();
};

const handleHistorySearch = (query: string) => {
  searchQuery.value = query;
  handleSearch();
};

const clearHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem('lawSearchHistory');
  toast.success('搜索历史已清空');
};

onMounted(() => {
  const saved = localStorage.getItem('lawSearchHistory');
  if (saved) {
    searchHistory.value = JSON.parse(saved);
  }
});
</script>

<template>
  <div class="flex flex-col justify-between h-[100dvh]"
    style="background: linear-gradient(to bottom, #3d374b, #191b23 20%)">
    <div class="flex-1 overflow-hidden p-3 flex flex-col">
      <div>
        <div class="h-5"></div>
        <div class="flex items-center">
          <span class="flex-1">
            <IconButton @click="$router.back()">
              <ArrowLeft class="size-5" />
            </IconButton>
          </span>
          <span class="flex-1 text-center text-xl">法规检索</span>
          <span class="flex-1"></span>
        </div>
        <div class="h-3"></div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <!-- 搜索框 -->
        <div class="max-w-3xl mx-auto mb-5">
          <div
            class="flex items-center bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 border border-gray-200 hover:shadow-xl hover:border-blue-500">
            <div class="px-4 text-gray-400 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input v-model="searchQuery" type="text" placeholder="请输入需要检索的内容..."
              class="flex-1 py-3.5 border-0 text-base text-gray-800 outline-none bg-transparent placeholder-gray-400"
              @keyup.enter="handleSearch" />
            <button
              class="flex items-center gap-2 px-5 h-[52px] bg-[#3f2d62] text-white border-0 text-base font-medium cursor-pointer transition-all duration-300 text-nowrap"
              @click="handleSearch">
              <span>搜索</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="transition-transform duration-300 group-hover:translate-x-1">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="max-w-3xl mx-auto flex-1">
          <!-- 搜索历史 -->
          <div v-if="searchHistory.length > 0" class="mb-8">
            <div class="flex items-center gap-2 mb-4">
              <Clock class="size-4 text-gray-400" />
              <span class="text-white text-base font-semibold flex-1">搜索历史</span>
              <button @click="clearHistory"
                class="text-gray-400 bg-transparent border-0 text-sm cursor-pointer transition-colors duration-300 hover:text-blue-500">清空</button>
            </div>
            <div class="flex flex-wrap gap-3">
              <button v-for="item in searchHistory" :key="item" @click="handleHistorySearch(item)"
                class="flex items-center gap-1.5 px-4 py-2 bg-white/10 text-white border-0 rounded-full text-sm cursor-pointer transition-all duration-300 backdrop-blur-md hover:bg-white/20 hover:-translate-y-0.5">
                {{ item }}
              </button>
            </div>
          </div>

          <!-- 热门搜索 -->
          <div class="mb-8">
            <div class="flex items-center gap-2 mb-4">
              <TrendingUp class="size-4 text-orange-400" />
              <span class="text-white text-base font-semibold flex-1">热门搜索</span>
            </div>
            <div class="flex flex-wrap gap-3">
              <button v-for="(item, index) in hotSearches" :key="item" @click="handleHotSearch(item)"
                class="flex items-center gap-1.5 px-4 py-2 bg-white/10 text-white border-0 rounded-full text-sm cursor-pointer transition-all duration-300 backdrop-blur-md hover:bg-white/20 hover:-translate-y-0.5 relative">
                <span class="inline-flex items-center justify-center w-4.5 h-4.5 rounded-full text-xs font-bold"
                  :class="index < 3 ? 'bg-orange-500 text-white' : 'bg-white/30'">{{ index + 1 }}</span>
                {{ item }}
              </button>
            </div>
          </div>

          <!-- 法规分类 -->
          <div class="mb-8">
            <div class="flex items-center gap-2 mb-4">
              <BookOpen class="size-4 text-blue-400" />
              <span class="text-white text-base font-semibold flex-1">法规分类</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button v-for="category in lawCategories" :key="category.name"
                @click="handleCategorySearch(category.name)"
                class="flex items-center gap-4 p-4 bg-white/10 border-0 rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-md text-left hover:bg-white/20 hover:-translate-y-0.5">
                <div class="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
                  :style="{ backgroundColor: category.color }">
                  <component :is="category.icon" class="size-5 text-white" />
                </div>
                <div class="flex-1">
                  <div class="text-white text-base font-semibold mb-1">{{ category.name }}</div>
                  <div class="text-gray-300 text-sm">{{ category.desc }}</div>
                </div>
              </button>
            </div>
          </div>

          <!-- 搜索提示 -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <BookOpen class="size-4 text-green-400" />
              <span class="text-white text-base font-semibold flex-1">搜索提示</span>
            </div>
            <div class="bg-white/5 rounded-xl p-5 backdrop-blur-md">
              <div v-for="tip in searchTips" :key="tip" class="flex items-center gap-3 py-2 text-gray-300 text-sm">
                <div class="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span>{{ tip }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 只保留必要的自定义样式 */
.group:hover svg {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>