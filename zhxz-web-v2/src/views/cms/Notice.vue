<template>
    <article-view-list title="通知公告" categoryId="1"></article-view-list>
</template>

<script>
import { getDicts } from '@/api/dict'
import Base from "@/views/base/Base"
import ArticleViewList from "@/views/cms/ArticleViewList"

export default {
	name: 'Notice',
    extends: Base,
    components: {
        ArticleViewList
    },
    data () {
        return {
            
        }
    },
}
</script>