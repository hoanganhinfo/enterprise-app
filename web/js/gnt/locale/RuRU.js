/*

Ext Gantt 2.2.10
Copyright(c) 2009-2013 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
Ext.define('Gnt.locale.RuRU', {
    extend      : 'Sch.locale.Locale',
    requires    : 'Sch.locale.RuRU',
    singleton   : true,

    l10n        : {
        'Gnt.util.DurationParser' : {
            unitsRegex : {
                MILLI       : /^мс$|^мил/i,
                SECOND      : /^с$|^сек/i,
                MINUTE      : /^м$|^мин/i,
                HOUR        : /^ч$|^час/i,
                DAY         : /^д$|^ден|^дне/i,
                WEEK        : /^н$|^нед/i,
                MONTH       : /^мес/i,
                QUARTER     : /^к$|^квар|^квр/i,
                YEAR        : /^г$|^год|^лет/i
            }
        },

        'Gnt.field.Duration' : {
            invalidText : "Неверное значение длительности"
        },

        'Gnt.feature.DependencyDragDrop': {
            fromText    : 'От: <strong>{0}</strong> - {1}<br/>',
            toText      : 'К: <strong>{0}</strong> - {1}',
            startText   : 'Начало',
            endText     : 'Конец'
        },

        'Gnt.Tooltip' : {
            startText       : 'Начинается: ',
            endText         : 'Заканчивается: ',
            durationText    : 'Длительность:'
        },

        'Gnt.plugin.TaskContextMenu' : {
            newTaskText         : 'Новая задача',
            deleteTask          : 'Удалить задачу(и)',
            editLeftLabel       : 'Редактировать левую метку',
            editRightLabel      : 'Редактировать правую метку',
            add                 : 'Добавить...',
            deleteDependency    : 'Удалить зависимость...',
            addTaskAbove        : 'Задачу выше',
            addTaskBelow        : 'Задачу ниже',
            addMilestone        : 'Веху',
            addSubtask          : 'Под-задачу',
            addSuccessor        : 'Последующую задачу',
            addPredecessor      : 'Предшествующую задачу',
            convertToMilestone  : 'Преобразовать в веху',
            convertToRegular    : 'Преобразовать в задачу'
        },

        'Gnt.plugin.DependencyEditor' : {
            fromText            : 'От',
            toText              : 'К',
            typeText            : 'Тип',
            lagText             : 'Задержка',
            endToStartText      : 'Конец-К-Началу',
            startToStartText    : 'Начало-К-Началу',
            endToEndText        : 'Конец-К-Концу',
            startToEndText      : 'Начало-К-Концу'
        },

        'Gnt.widget.calendar.Calendar' : {
            dayOverrideNameHeaderText : 'Название',
            overrideName       : 'Наименование',
            startDate          : 'Начало',
            endDate            : 'Окончание',
            error              : 'Ошибка',
            dateText           : 'Дата',
            addText            : 'Добавить',
            editText           : 'Изменить',
            removeText         : 'Удалить',
            workingDayText     : 'Рабочий день',
            weekendsText       : 'Выходные',
            overriddenDayText  : 'Особый день',
            overriddenWeekText : 'Особая неделя',
            workingTimeText    : 'Рабочее время',
            nonworkingTimeText : 'Нерабочее время',
            dayOverridesText   : 'Особые дни',
            weekOverridesText  : 'Особые недели',
            okText             : 'Ok',
            cancelText         : 'Отменить',
            parentCalendarText : 'Родительский календарь',
            noParentText       : 'Нет родительского календаря',
            selectParentText   : 'Выбрать родительский календарь',
            newDayName         : '[Без имени]',
            calendarNameText   : 'Название календаря',
            tplTexts           : {
                tplWorkingHours     : 'Рабочие часы для',
                tplIsNonWorking     : 'нерабочее',
                tplOverride         : 'особый',
                tplInCalendar       : 'в календаре',
                tplDayInCalendar    : 'обычный день в календаре',
                tplBasedOn          : 'Основан на'
            },
            overrideErrorText       : 'Для этого дня уже создано исключение',
            overrideDateError       : 'Для {0} уже создано исключение',
            startAfterEndError      : 'Дата начала должна быть раньше даты окончания',
            weeksIntersectError     : 'Особые недели не должны пересекаться'
        },

        'Gnt.widget.calendar.AvailabilityGrid' : {
            startText           : 'Начало',
            endText             : 'Конец',
            addText             : 'Добавить',
            removeText          : 'Удалить',
            error               : 'Ошибка'
        },

        'Gnt.widget.calendar.DayEditor' : {
            workingTimeText     : 'Рабочее время',
            nonworkingTimeText  : 'Нерабочее время'
        },

        'Gnt.widget.calendar.WeekEditor' : {
            defaultTimeText     : 'Стандартное время',
            workingTimeText     : 'Рабочее время',
            nonworkingTimeText  : 'Нерабочее время',
            error               : 'Ошибка',
            noOverrideError     : 'Особая неделя содержит только стандартные дни - нет данных для сохранения'
        },

        'Gnt.widget.calendar.ResourceCalendarGrid' : {
            name        : 'Ресурс',
            calendar    : 'Календарь'
        },

        'Gnt.widget.calendar.CalendarWindow' : {
            ok      : 'Принять',
            cancel  : 'Отменить'
        },

        'Gnt.field.Assignment' : {
            cancelText : 'Отменить',
            closeText  : 'Сохранить и закрыть'
        },

        'Gnt.column.AssignmentUnits' : {
            text : 'Единицы'
        },

        'Gnt.column.Duration' : {
            text : 'Длительность'
        },

        'Gnt.column.Effort' : {
            text : 'Трудозатраты'
        },

        'Gnt.column.EndDate' : {
            text : 'Конец'
        },

        'Gnt.column.PercentDone' : {
            text : '% завершения'
        },

        'Gnt.column.ResourceAssignment' : {
            text : 'Назначенные ресурсы'
        },

        'Gnt.column.ResourceName' : {
            text : 'Имя ресурса'
        },

        'Gnt.column.SchedulingMode' : {
            text : 'Режим'
        },

        'Gnt.column.Predecessor' : {
            text : 'Предшествующие'
        },

        'Gnt.column.Successor' : {
            text : 'Последующие'
        },

        'Gnt.column.StartDate' : {
            text : 'Начало'
        },

        'Gnt.column.WBS' : {
            text : '#'
        },

        'Gnt.column.Sequence' : {
            text : '#'
        },

        'Gnt.widget.taskeditor.TaskForm' : {
            taskNameText            : 'Наименование',
            durationText            : 'Длительность',
            datesText               : 'Даты',
            baselineText            : 'Исходный план',
            startText               : 'Начало',
            finishText              : 'Конец',
            percentDoneText         : '% завершения',
            baselineStartText       : 'Начало',
            baselineFinishText      : 'Конец',
            baselinePercentDoneText : '% завершения',
            effortText              : 'Трудозатраты',
            invalidEffortText       : 'Неверное значение трудозатрат',
            calendarText            : 'Календарь',
            schedulingModeText      : 'Режим'
        },

        'Gnt.widget.DependencyGrid' : {
            idText              : 'ID',
            taskText            : 'Задача',
            blankTaskText       : 'Пожалуйста выберите задачу',
            invalidDependencyText       : 'Неверная зависимость',
            parentChildDependencyText   : 'Обнаружена зависимость между родительской и вложенной задачами',
            duplicatingDependencyText   : 'Повторная зависимость',
            transitiveDependencyText    : 'Транзитивная зависимость',
            cyclicDependencyText        : 'Цикличная зависимость',
            typeText            : 'Тип',
            lagText             : 'Задержка',
            clsText             : 'CSS класс',
            endToStartText      : 'Конец-К-Началу',
            startToStartText    : 'Начало-К-Началу',
            endToEndText        : 'Конец-К-Концу',
            startToEndText      : 'Начало-К-Концу'
        },

        'Gnt.widget.AssignmentEditGrid' : {
            confirmAddResourceTitle : 'Подтверждение',
            confirmAddResourceText  : 'Ресурс с именем &quot;{0}&quot; не найден. Добавить его в список ресурсов?',
            noValueText             : 'Пожалуйста выберите ресурс',
            noResourceText          : 'Ресурс с именем &quot;{0}&quot; не найден'
        },

        'Gnt.widget.taskeditor.TaskEditor' : {
            generalText             : 'Основные',
            resourcesText           : 'Ресурсы',
            dependencyText          : 'Предшествующие задачи',
            addDependencyText       : 'Добавить',
            dropDependencyText      : 'Удалить',
            notesText               : 'Примечание',
            advancedText            : 'Дополнительно',
            wbsCodeText             : 'Код WBS',
            addAssignmentText       : 'Добавить',
            dropAssignmentText      : 'Удалить'
        },

        'Gnt.plugin.TaskEditor' : {
            title           : 'Информация по задаче',
            alertCaption    : 'Информация',
            alertText       : 'Пожалуйста исправьте отмеченные ошибки перед сохранением',
            okText          : 'Принять',
            cancelText      : 'Отмена'
        },

        'Gnt.field.EndDate' : {
            endBeforeStartText : 'Дата окончания раньше даты начала'
        },

        'Gnt.column.Note'   : {
            text            : 'Примечание'
        },

        'Gnt.column.AddNew' : {
            text            : 'Добавить столбец...'
        },

        'Gnt.column.EarlyStartDate' : {
            text            : 'Раннее начало'
        },

        'Gnt.column.EarlyEndDate' : {
            text            : 'Раннее окончание'
        },

        'Gnt.column.LateStartDate' : {
            text            : 'Позднее начало'
        },

        'Gnt.column.LateEndDate' : {
            text            : 'Позднее окончание'
        },

        'Gnt.field.Calendar' : {
            calendarNotApplicable : 'Календарь задачи не пересекается с календарями назначенных ресурсов'
        },

        'Gnt.column.Slack' : {
            text            : 'Резерв времени'
        },

        'Gnt.column.Name'   : {
            text            : 'Наименование задачи'
        },

        'Gnt.column.BaselineStartDate'   : {
            text            : 'Плановое начало'
        },

        'Gnt.column.BaselineEndDate'   : {
            text            : 'Плановый конец'
        },

        'Gnt.column.Milestone'   : {
            text            : 'Веха'
        },

        'Gnt.field.Milestone'   : {
            yes             : 'Да',
            no              : 'Нет'
        }
    }
});
