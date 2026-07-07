<template>
  <div class="flex gap-5 items-start pb-12 border-b border-border/50 last:border-0 last:pb-0 animate-pulse">
    <!-- Avatar Skeleton -->
    <div class="shrink-0 w-14 h-14 rounded-[1.25rem] bg-gray-200 border border-border ring-4 ring-surface shadow-subtle"></div>
    
    <!-- Content Skeleton -->
    <div class="flex-1 min-w-0 pt-1">
      <!-- Header (Name & Time) -->
      <div class="flex items-center gap-2 mb-2">
        <div class="h-4 bg-gray-200 rounded w-24"></div>
        <span class="text-muted text-sm">&middot;</span>
        <div class="h-3 bg-gray-200 rounded w-16"></div>
      </div>
      
      <!-- Text -->
      <div class="space-y-2 mb-5">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      <!-- Footer (Claps) -->
      <div class="flex items-center gap-6 mt-1">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-gray-200"></div>
          <div class="h-3 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
    </div>
  </div>
</template>
