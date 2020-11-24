export const filterStringValue = (filterBy: string | undefined, value: string | undefined): boolean => !filterBy || value === filterBy;

export const queryStringValue = (queryBy: string | undefined, value: string | undefined): boolean =>
  !queryBy || !!value?.toLocaleLowerCase().includes(queryBy.toLocaleLowerCase());
