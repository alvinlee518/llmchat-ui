const RowStateOptions = [
  {
    label: '有效',
    value: 1,
  },
  {
    label: '无效',
    value: 0,
  },
];

const findRowStateLabel = (value: number) => {
  return RowStateOptions.find((item) => item.value === value)?.label ?? '未知';
};

const ParagraphStateOptions = [
  {
    label: '待处理',
    value: 0,
  },
  {
    label: '处理中',
    value: 1,
  },
  {
    label: '已结束',
    value: 2,
  },
  {
    label: '错误',
    value: 3,
  },
];

const findParagraphStateLabel = (value: number) => {
  return ParagraphStateOptions.find((item) => item.value === value)?.label ?? '未知';
};

const PublishStateOptions = [
  {
    label: '未发布',
    value: 0,
  },
  {
    label: '已发布',
    value: 1,
  },
];

const findPublishStateLabel = (value: number) => {
  return PublishStateOptions.find((item) => item.value === value)?.label ?? '未知';
};

const DataScopeOptions = [
  {
    label: '全部数据权限',
    value: 0,
  },
  {
    label: '自定义数据权限',
    value: 1,
  },
  {
    label: '本部门数据权限',
    value: 2,
  },
  {
    label: '本部门及下属部门数据权限',
    value: 3,
  },
  {
    label: '仅本人数据权限',
    value: 4,
  },
];

const findDataScopeLabel = (value: number) => {
  return DataScopeOptions.find((item) => item.value === value)?.label ?? '未知';
};

const UserScopeOptions = [
  {
    label: '未授权',
    value: 0,
  },
  {
    label: '已授权',
    value: 1,
  },
];

const findUserScopeLabel = (value: number) => {
  return UserScopeOptions.find((item) => item.value === value)?.label ?? '未知';
};

const BooleanOptions = [
  {
    label: '否',
    value: 0,
  },
  {
    label: '是',
    value: 1,
  },
];

const findBooleanLabel = (value: number) => {
  return BooleanOptions.find((item) => item.value === value)?.label ?? '未知';
};

const MenuTypeOptions = [
  {
    label: '目录',
    value: 0,
  },
  {
    label: '菜单',
    value: 1,
  },
  {
    label: '按钮',
    value: 2,
  },
];

const findMenuTypeLabel = (value: number) => {
  return MenuTypeOptions.find((item) => item.value === value)?.label ?? '未知';
};

export {
  RowStateOptions,
  ParagraphStateOptions,
  PublishStateOptions,
  findRowStateLabel,
  findParagraphStateLabel,
  findPublishStateLabel,
  DataScopeOptions,
  findDataScopeLabel,
  UserScopeOptions,
  findUserScopeLabel,
  BooleanOptions,
  findBooleanLabel,
  MenuTypeOptions,
  findMenuTypeLabel,
};
