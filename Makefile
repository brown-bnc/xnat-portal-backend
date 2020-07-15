POETRY_RUN := poetry run

SOURCE_FILES := xnat_portal
TEST_FILES := tests

.PHONY: all
all: format-check lint check test

.PHONY: format-check
format-check:
	$(POETRY_RUN) black --check $(SOURCE_FILES) $(TEST_FILES)

.PHONY: lint
lint:
	$(POETRY_RUN) pylint $(SOURCE_FILES) $(TEST_FILES)

.PHONY: check
check:
	$(POETRY_RUN) mypy --strict $(SOURCE_FILES)

.PHONY: test
test:
	$(POETRY_RUN) pytest -vv --cov --cov-report html --cov-report term --capture=tee-sys

.PHONY: format
format:
	$(POETRY_RUN) black $(SOURCE_FILES) $(TEST_FILES)
